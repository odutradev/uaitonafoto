import defineAction from '@factories/defineAction'
import eventRepository from '../../repositories/events'
import guestRepository from '../../repositories/guests'
import { getEventPhase } from '../../utils/eventWindows'
import { signGuestToken } from '../../utils/guestToken'
import toGuestEventInfo from './utils/toGuestEventInfo'
import {
  guestEventInfoSchema,
  guestTokenParamsSchema,
  joinEventResponseSchema,
  joinEventSchema
} from './schemas'

import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type {
  GetGuestEventRequest,
  GuestEventInfo,
  JoinEventRequest,
  JoinEventResponse
} from './types'

export const getGuestEvent = defineAction(
  {
    method: 'get',
    path: '/guest/events/:token',
    summary: 'Obter dados públicos do evento pelo link do convidado',
    tags: ['Convidado'],
    schema: { params: guestTokenParamsSchema },
    responses: {
      200: { description: 'Dados públicos do evento', schema: guestEventInfoSchema },
      404: { description: 'Link do evento inválido' }
    }
  },
  async ({ params, manageError }: ManageRequestBody<GetGuestEventRequest>): ManageRequestResponse<GuestEventInfo> => {
    const event = await eventRepository.findByGuestToken(params.token)
    if (!event) return manageError({ code: 'not_found' })

    return toGuestEventInfo(event)
  }
)

export const joinEvent = defineAction(
  {
    method: 'post',
    path: '/guest/events/:token/join',
    summary: 'Entrar no evento como convidado e obter token de sessão',
    tags: ['Convidado'],
    rateLimit: { limit: 30 },
    schema: { params: guestTokenParamsSchema, body: joinEventSchema },
    responses: {
      200: { description: 'Sessão do convidado criada', schema: joinEventResponseSchema },
      403: { description: 'A galeria do evento já foi encerrada' },
      404: { description: 'Link do evento inválido' }
    }
  },
  async ({ params, data, manageError }: ManageRequestBody<JoinEventRequest>): ManageRequestResponse<JoinEventResponse> => {
    const event = await eventRepository.findByGuestToken(params.token)
    if (!event) return manageError({ code: 'not_found' })
    if (getEventPhase(event) === 'expired') return manageError({ code: 'forbidden' })

    const guest = await guestRepository.create({ eventId: event.id, name: data.name })

    return {
      guestToken: signGuestToken(guest.id, event.galleryExpiresAt),
      guest: { id: guest.id, name: guest.name },
      event: toGuestEventInfo(event)
    }
  }
)
