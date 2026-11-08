import defineAction from '@factories/defineAction'
import { buildPaginatedResponse, getPaginationOptions } from '@factories/pagination/utils'
import eventRepository from '../../repositories'
import defaultEventSettings from './utils/defaultEventSettings'
import findMemberRole from './utils/findMemberRole'
import isValidEventPeriod from './utils/isValidEventPeriod'
import toEventResponse from './utils/toEventResponse'
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
    if (!ids.userId) return manageError({ code: 'unauthorized' })
    if (!isValidEventPeriod(data.startsAt, data.endsAt)) {
      return manageError({ code: 'bad_request', details: 'endsAt must be after startsAt' })
    }

    const event = await eventRepository.create({
      ...data,
      settings: { ...defaultEventSettings, ...data.settings },
      creatorId: ids.userId
    })

    return toEventResponse(event, 'creator')
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

    return buildPaginatedResponse(
      {
        count: result.count,
        rows: result.rows.map((event) => toEventResponse(event, findMemberRole(event, userId)!))
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

    return toEventResponse(event, role)
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
    const endsAt = data.endsAt ?? event.endsAt
    if (!isValidEventPeriod(startsAt, endsAt)) {
      return manageError({ code: 'bad_request', details: 'endsAt must be after startsAt' })
    }

    const updated = await eventRepository.update(event.id, data)
    if (!updated) return manageError({ code: 'not_found' })

    return toEventResponse(updated, role)
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

    const deleted = await eventRepository.delete(event.id)
    if (!deleted) return manageError({ code: 'not_found' })

    return toEventResponse(event, 'creator')
  }
)
