import defineAction from '@factories/defineAction'
import { buildPaginatedResponse, getPaginationOptions } from '@factories/pagination/utils'
import logRepository from '@domains/system/repositories'
import userRepository from '@domains/users/repositories'
import purchaseRepository from '@domains/payments/repositories/purchases'
import creditUsageRepository from '@domains/payments/repositories/creditUsages'
import eventRepository from '../../repositories/events'
import guestRepository from '../../repositories/guests'
import { ensureCurrentEventPin, generatePin } from '../../utils/eventPin'
import { broadcastEvent } from '@realtime'
import { purgeEventPhotos } from '../../utils/photoStorage'
import { computeEventWindows, getEventMaxDurationHours, getEventMaxEndsAt, getEventPhase } from '../../utils/eventWindows'
import type { EventCreditType, EventEntity, EventMemberRole, EventSettings } from '../../repositories/events/types'
import { EVENT_PLAN_LIMITS, resolveUserPlanTier } from '../../utils/eventLimits'
import {
  createEventSchema,
  eventParamsSchema,
  eventSchema,
  listEventsQuerySchema,
  listEventsResponseSchema,
  updateEventSchema
} from './schemas'

export const findMemberRole = (event: EventEntity, userId: string): EventMemberRole | undefined =>
  event.members.find((member) => member.userId === userId)?.role

const isValidEventPeriod = (startsAt: string, endsAt: string): boolean =>
  new Date(endsAt).getTime() > new Date(startsAt).getTime()

const buildDefaultEventSettings = (creditType: EventCreditType = 'paid'): EventSettings => ({
  uploadWindowHours: 0,
  galleryDurationDays: creditType === 'free' ? 14 : 90,
  photoVisibility: 'during_event',
  pinEnabled: true,
  pin: generatePin(),
  pinRotate: true,
  pinRotationMinutes: 15,
  pinUpdatedAt: new Date().toISOString(),
  moderationEnabled: false,
  challengesEnabled: false
})

const toEventResponse = (entity: EventEntity, myRole: EventMemberRole): EventResponse => {
  const tier = entity.planTier || 'single'
  const limits = EVENT_PLAN_LIMITS[tier] || EVENT_PLAN_LIMITS.single

  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    type: entity.type,
    creditType: entity.creditType,
    planTier: tier,
    maxOrganizers: limits.maxOrganizers,
    maxScreens: limits.maxScreens,
    startsAt: entity.startsAt,
    endsAt: entity.endsAt,
    guestToken: entity.guestToken,
    settings: entity.settings,
    customization: entity.customization,
    uploadsCloseAt: entity.uploadsCloseAt,
    galleryExpiresAt: entity.galleryExpiresAt,
    closedAt: entity.closedAt,
    phase: getEventPhase(entity),
    challenges: entity.challenges ?? [],
    members: entity.members,
    screens: entity.screens,
    screenHistory: entity.screenHistory ?? [],
    myRole,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt
  }
}

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
    path: '/events/create',
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
    const planTier = data.planTier ?? (await resolveUserPlanTier(user.id))

    try {
      const event = await eventRepository.create({
        ...data,
        creditType,
        planTier,
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
    path: '/events/list',
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
    path: '/events/:id/details',
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
    path: '/events/:id/update',
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

    const isAlreadyStarted = new Date(event.startsAt).getTime() <= Date.now()
    const isDifferentMinute = data.startsAt
      ? Math.floor(new Date(data.startsAt).getTime() / 60_000) !== Math.floor(new Date(event.startsAt).getTime() / 60_000)
      : false

    if (data.startsAt && isAlreadyStarted && isDifferentMinute) {
      return manageError({
        code: 'bad_request',
        details: 'A data e hora de início não podem ser alteradas após o início do evento.'
      })
    }

    const startsAt = isAlreadyStarted && !isDifferentMinute ? event.startsAt : (data.startsAt ?? event.startsAt)
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
    path: '/events/:id/remove',
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

export const startEvent = defineAction(
  {
    method: 'post',
    path: '/events/:id/start',
    summary: 'Iniciar o evento manualmente (atualiza o início para o momento atual)',
    tags: ['Eventos'],
    authenticate: true,
    schema: { params: eventParamsSchema },
    responses: {
      200: { description: 'Evento iniciado com sucesso', schema: eventSchema },
      400: { description: 'Evento já iniciado' },
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

    if (new Date(event.startsAt).getTime() <= Date.now() && !event.closedAt) {
      return manageError({ code: 'bad_request', details: 'O evento já foi iniciado.' })
    }

    const now = new Date()
    const startsAt = now.toISOString()
    const durationHours = getEventMaxDurationHours(event.creditType)
    const endsAt = new Date(now.getTime() + durationHours * 60 * 60 * 1000).toISOString()
    const windows = computeEventWindows(endsAt, event.settings)

    const updated = await eventRepository.update(event.id, {
      startsAt,
      endsAt,
      ...windows,
      closedAt: null
    })
    if (!updated) return manageError({ code: 'not_found' })

    const currentEvent = await ensureCurrentEventPin(updated)
    broadcastEvent(currentEvent.id, 'event:started', { startsAt, endsAt })
    return toEventResponse(currentEvent, role)
  }
)

export const closeEvent = defineAction(
  {
    method: 'post',
    path: '/events/:id/close',
    summary: 'Encerrar o evento manualmente (bloqueia envios e libera galeria)',
    tags: ['Eventos'],
    authenticate: true,
    schema: { params: eventParamsSchema },
    responses: {
      200: { description: 'Evento encerrado com sucesso', schema: eventSchema },
      400: { description: 'Evento não iniciado ou já encerrado' },
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

    if (new Date(event.startsAt).getTime() > Date.now()) {
      return manageError({ code: 'bad_request', details: 'O evento ainda não foi iniciado.' })
    }

    if (event.closedAt) {
      return manageError({ code: 'bad_request', details: 'O evento já está encerrado.' })
    }

    const closedAt = new Date().toISOString()
    const updated = await eventRepository.update(event.id, {
      closedAt,
      uploadsCloseAt: closedAt
    })
    if (!updated) return manageError({ code: 'not_found' })

    const currentEvent = await ensureCurrentEventPin(updated)
    broadcastEvent(currentEvent.id, 'event:closed', { closedAt })
    return toEventResponse(currentEvent, role)
  }
)

export const reopenEvent = defineAction(
  {
    method: 'post',
    path: '/events/:id/reopen',
    summary: 'Reabrir evento dentro do limite de 8 horas',
    tags: ['Eventos'],
    authenticate: true,
    schema: { params: eventParamsSchema },
    responses: {
      200: { description: 'Evento reaberto com sucesso', schema: eventSchema },
      400: { description: 'Evento não está encerrado' },
      403: { description: 'Janela de 8 horas expirada ou usuário sem permissão' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<GetEventRequest>): ManageRequestResponse<EventResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const event = await eventRepository.findById(params.id)
    if (!event) return manageError({ code: 'not_found' })

    const role = findMemberRole(event, ids.userId)
    if (!role) return manageError({ code: 'forbidden' })

    if (!event.closedAt) {
      return manageError({ code: 'bad_request', details: 'O evento não está encerrado.' })
    }

    const durationHours = getEventMaxDurationHours(event.creditType)
    const maxEndsAt = getEventMaxEndsAt(event.startsAt, event.creditType)
    if (Date.now() >= new Date(maxEndsAt).getTime()) {
      return manageError({
        code: 'forbidden',
        details: `O evento não pode mais ser reaberto pois ultrapassou a duração limite de ${durationHours} horas.`
      })
    }

    const endsAt = maxEndsAt
    const windows = computeEventWindows(endsAt, event.settings)

    const updated = await eventRepository.update(event.id, {
      endsAt,
      ...windows,
      closedAt: null
    })
    if (!updated) return manageError({ code: 'not_found' })

    const currentEvent = await ensureCurrentEventPin(updated)
    broadcastEvent(currentEvent.id, 'event:reopened', { endsAt })
    return toEventResponse(currentEvent, role)
  }
)
