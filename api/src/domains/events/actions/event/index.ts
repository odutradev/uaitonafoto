import defineAction from '@factories/defineAction'
import { buildPaginatedResponse, getPaginationOptions } from '@factories/pagination/utils'
import logRepository from '@domains/system/repositories'
import userRepository from '@domains/users/repositories'
import purchaseRepository from '@domains/payments/repositories/purchases'
import creditUsageRepository from '@domains/payments/repositories/creditUsages'
import eventRepository from '../../repositories/events'
import guestRepository from '../../repositories/guests'
import { ensureCurrentEventPin } from '../../utils/eventPin'
import { broadcastEvent } from '../../utils/eventStream'
import { purgeEventPhotos } from '../../utils/purgeEventPhotos'
import buildDefaultEventSettings from './utils/defaultEventSettings'
import findMemberRole from './utils/findMemberRole'
import isValidEventPeriod from './utils/isValidEventPeriod'
import toEventResponse from './utils/toEventResponse'
import { computeEventWindows } from '../../utils/eventWindows'
import {
  createEventSchema,
  eventParamsSchema,
  eventSchema,
  listEventsQuerySchema,
  listEventsResponseSchema,
  updateEventSchema
} from './schemas'

import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type {
  CreateEventRequest,
  EventResponse,
  GetEventRequest,
  ListEventsRequest,
  ListEventsResponse,
  UpdateEventRequest
} from './types'

export const createEvent = defineAction(
  {
    method: 'post',
    path: '/events',
    summary: 'Criar evento (o usuário autenticado se torna o criador)',
    tags: ['Eventos'],
    authenticate: true,
    schema: { body: createEventSchema },
    responses: {
      200: { description: 'Evento criado', schema: eventSchema }
    }
  },
  async ({ ids, data, manageError }: ManageRequestBody<CreateEventRequest>): ManageRequestResponse<EventResponse> => {
    const userId = ids.userId
    if (!userId) return manageError({ code: 'unauthorized' })

    const user = await userRepository.findById(userId)
    if (!user) return manageError({ code: 'user_not_found' })

    let creditType = data.creditType
    if (creditType) {
      if (creditType === 'paid' && user.paidCredits < 1) {
        return manageError({ code: 'bad_request', details: 'Saldo insuficiente de créditos normais.' })
      }
      if (creditType === 'free' && user.freeCredits < 1) {
        return manageError({ code: 'bad_request', details: 'Saldo insuficiente de créditos de teste grátis.' })
      }
    } else {
      if (user.paidCredits >= 1) {
        creditType = 'paid'
      } else if (user.freeCredits >= 1) {
        creditType = 'free'
      } else {
        return manageError({ code: 'bad_request', details: 'Você não possui créditos disponíveis para criar um evento.' })
      }
    }

    const durationHours = creditType === 'free' ? 4 : 8
    const calculatedEndsAt = new Date(new Date(data.startsAt).getTime() + durationHours * 60 * 60 * 1000).toISOString()
    const endsAt = data.endsAt || calculatedEndsAt

    if (!isValidEventPeriod(data.startsAt, endsAt)) {
      return manageError({ code: 'bad_request', details: 'endsAt must be after startsAt' })
    }

    const deductedUser = await userRepository.deductCredits(user.id, creditType, 1)
    if (!deductedUser) {
      return manageError({ code: 'bad_request', details: 'Não foi possível debitar o crédito. Saldo insuficiente.' })
    }
    await purchaseRepository.consumeCredit(user.id, creditType)

    const settings = { ...buildDefaultEventSettings(creditType), ...data.settings }
    const customization = data.customization ?? user.customization

    try {
      const event = await eventRepository.create({
        ...data,
        creditType,
        endsAt,
        settings,
        customization,
        ...computeEventWindows(endsAt, settings),
        creatorId: user.id
      })

      await creditUsageRepository.create({
        userId: user.id,
        eventId: event.id,
        eventName: event.name,
        creditType,
        amount: 1,
        createdAt: event.createdAt
      })

      logRepository.create({
        category: 'user',
        level: 'info',
        action: 'EVENT_CREATED',
        title: 'Evento criado',
        description: `Evento "${event.name}" criado com crédito ${creditType === 'free' ? 'grátis' : 'normal'} por ${user.fullName || user.name}`,
        userId: user.id,
        userEmail: user.email,
        targetId: event.id,
        targetName: event.name,
        details: {
          creditType,
          startsAt: event.startsAt,
          endsAt: event.endsAt,
          durationHours,
          galleryDurationDays: settings.galleryDurationDays
        }
      })

      return toEventResponse(event, 'creator')
    } catch (error) {
      await userRepository.addCredits(user.id, creditType, 1)
      throw error
    }
  }
)

export const listMyEvents = defineAction(
  {
    method: 'get',
    path: '/events',
    summary: 'Listar eventos em que o usuário é criador ou organizador',
    tags: ['Eventos'],
    authenticate: true,
    schema: { query: listEventsQuerySchema },
    responses: {
      200: { description: 'Lista paginada de eventos', schema: listEventsResponseSchema }
    }
  },
  async ({ ids, query, manageError }: ManageRequestBody<ListEventsRequest>): ManageRequestResponse<ListEventsResponse> => {
    const userId = ids.userId
    if (!userId) return manageError({ code: 'unauthorized' })

    const { page, limit, offset } = getPaginationOptions(query)
    const result = await eventRepository.listByMember({ userId, limit, offset })
    const rows = await Promise.all(result.rows.map((event) => ensureCurrentEventPin(event)))

    return buildPaginatedResponse(
      {
        count: result.count,
        rows: rows.map((event) => toEventResponse(event, findMemberRole(event, userId)!))
      },
      page,
      limit
    )
  }
)

export const getEvent = defineAction(
  {
    method: 'get',
    path: '/events/:id',
    summary: 'Obter evento da equipe organizadora',
    tags: ['Eventos'],
    authenticate: true,
    schema: { params: eventParamsSchema },
    responses: {
      200: { description: 'Detalhes do evento', schema: eventSchema },
      403: { description: 'Usuário não pertence à equipe do evento' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<GetEventRequest>): ManageRequestResponse<EventResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const event = await eventRepository.findById(params.id)
    if (!event) return manageError({ code: 'not_found' })

    const role = findMemberRole(event, ids.userId)
    if (!role) return manageError({ code: 'forbidden' })

    const currentEvent = await ensureCurrentEventPin(event)
    return toEventResponse(currentEvent, role)
  }
)

export const updateEvent = defineAction(
  {
    method: 'put',
    path: '/events/:id',
    summary: 'Atualizar dados e configurações do evento (criador ou organizador)',
    tags: ['Eventos'],
    authenticate: true,
    schema: { params: eventParamsSchema, body: updateEventSchema },
    responses: {
      200: { description: 'Evento atualizado', schema: eventSchema },
      403: { description: 'Usuário não pertence à equipe do evento' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ ids, params, data, manageError }: ManageRequestBody<UpdateEventRequest>): ManageRequestResponse<EventResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const event = await eventRepository.findById(params.id)
    if (!event) return manageError({ code: 'not_found' })

    const role = findMemberRole(event, ids.userId)
    if (!role) return manageError({ code: 'forbidden' })

    const startsAt = data.startsAt ?? event.startsAt
    const durationHours = event.creditType === 'free' ? 4 : 8
    const calculatedEndsAt = new Date(new Date(startsAt).getTime() + durationHours * 60 * 60 * 1000).toISOString()
    const endsAt = data.endsAt ?? (data.startsAt ? calculatedEndsAt : event.endsAt)
    if (!isValidEventPeriod(startsAt, endsAt)) {
      return manageError({ code: 'bad_request', details: 'endsAt must be after startsAt' })
    }

    const shouldResetPinTimer =
      data.settings?.pin !== undefined ||
      data.settings?.pinRotate !== undefined ||
      data.settings?.pinEnabled !== undefined ||
      data.settings?.pinRotationMinutes !== undefined

    const nextSettings = data.settings
      ? {
          ...data.settings,
          ...(shouldResetPinTimer ? { pinUpdatedAt: new Date().toISOString() } : {})
        }
      : undefined

    const windows = computeEventWindows(endsAt, { ...event.settings, ...nextSettings })
    const updated = await eventRepository.update(event.id, {
      ...data,
      settings: nextSettings,
      ...windows
    })
    if (!updated) return manageError({ code: 'not_found' })

    const currentEvent = await ensureCurrentEventPin(updated)
    if (data.settings) {
      broadcastEvent(currentEvent.id, 'pin:change', {
        pin: currentEvent.settings.pinEnabled ? currentEvent.settings.pin : null
      })
    }
    return toEventResponse(currentEvent, role)
  }
)

export const deleteEvent = defineAction(
  {
    method: 'delete',
    path: '/events/:id',
    summary: 'Excluir evento (somente criador)',
    tags: ['Eventos'],
    authenticate: true,
    schema: { params: eventParamsSchema },
    responses: {
      200: { description: 'Evento excluído', schema: eventSchema },
      403: { description: 'Somente o criador pode excluir o evento' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<GetEventRequest>): ManageRequestResponse<EventResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const event = await eventRepository.findById(params.id)
    if (!event) return manageError({ code: 'not_found' })
    if (findMemberRole(event, ids.userId) !== 'creator') return manageError({ code: 'forbidden' })

    await purgeEventPhotos(event.id)
    await guestRepository.deleteByEvent(event.id)

    const deleted = await eventRepository.delete(event.id)
    if (!deleted) return manageError({ code: 'not_found' })

    return toEventResponse(event, 'creator')
  }
)
