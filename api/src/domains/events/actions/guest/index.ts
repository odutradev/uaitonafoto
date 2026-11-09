import defineAction from '@factories/defineAction'
import eventRepository from '../../repositories/events'
import guestRepository from '../../repositories/guests'
import photoRepository from '../../repositories/photos'
import guestSessionMiddleware from '../../middlewares/guestSession'
import { ensureCurrentEventPin } from '../../utils/eventPin'
import { checkPinLockout, recordPinFailure, resetPinLockout } from '../../utils/pinLockout'
import { getEventPhase } from '../../utils/eventWindows'
import { signGuestToken } from '../../utils/guestToken'
import type { EventEntity } from '../../repositories/events/types'

const toGuestEventInfo = (event: EventEntity): GuestEventInfo => ({
  name: event.name,
  description: event.description,
  type: event.type,
  startsAt: event.startsAt,
  endsAt: event.endsAt,
  uploadsCloseAt: event.uploadsCloseAt,
  galleryExpiresAt: event.galleryExpiresAt,
  photoVisibility: event.settings.photoVisibility,
  requiresPin: event.settings.pinEnabled,
  customization: event.customization,
  challengesEnabled: Boolean(event.settings.challengesEnabled),
  challenges: event.settings.challengesEnabled
    ? (event.challenges?.filter((c) => c.active) ?? [])
    : [],
  phase: getEventPhase(event)
})
import {
  guestEventInfoSchema,
  guestSessionResponseSchema,
  guestTokenParamsSchema,
  joinEventResponseSchema,
  joinEventSchema
} from './schemas'

import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type {
  GetGuestEventRequest,
  GuestEventInfo,
  GuestSessionResponse,
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
      403: { description: 'PIN inválido ou galeria encerrada' },
      404: { description: 'Link do evento inválido' }
    }
  },
  async ({ defaultExpress, params, data, manageError }: ManageRequestBody<JoinEventRequest>): ManageRequestResponse<JoinEventResponse> => {
    const foundEvent = await eventRepository.findByGuestToken(params.token)
    if (!foundEvent) return manageError({ code: 'not_found' })
    if (getEventPhase(foundEvent) === 'expired') return manageError({ code: 'forbidden' })

    const event = await ensureCurrentEventPin(foundEvent)
    if (event.settings.pinEnabled) {
      const lockoutStatus = checkPinLockout({
        scope: 'guest',
        targetId: event.id,
        req: defaultExpress.req,
        res: defaultExpress.res
      })
      if (lockoutStatus.isLocked) {
        return manageError({
          code: lockoutStatus.isPermanent ? 'forbidden' : 'too_many_requests',
          details: lockoutStatus.message
        })
      }

      if (data.pin !== event.settings.pin) {
        const failure = recordPinFailure({
          scope: 'guest',
          targetId: event.id,
          req: defaultExpress.req,
          res: defaultExpress.res
        })
        return manageError({
          code: failure.isPermanent ? 'forbidden' : failure.isLocked ? 'too_many_requests' : 'forbidden',
          details: failure.message
        })
      }

      resetPinLockout({
        scope: 'guest',
        targetId: event.id,
        req: defaultExpress.req
      })
    }

    const guest = await guestRepository.create({ eventId: event.id, name: data.name })

    return {
      guestToken: signGuestToken(guest.id, event.galleryExpiresAt),
      guest: { id: guest.id, name: guest.name },
      event: toGuestEventInfo(event)
    }
  }
)

export const getGuestSession = defineAction(
  {
    method: 'get',
    path: '/guest/me',
    summary: 'Obter sessão do convidado: dados, evento e cota de fotos',
    tags: ['Convidado'],
    middlewares: [guestSessionMiddleware],
    responses: {
      200: { description: 'Sessão do convidado', schema: guestSessionResponseSchema }
    }
  },
  async ({ ids, manageError }: ManageRequestBody): ManageRequestResponse<GuestSessionResponse> => {
    if (!ids.guestId) return manageError({ code: 'unauthorized' })

    const context = await guestRepository.findContext(ids.guestId)
    if (!context) return manageError({ code: 'user_not_found' })

    const { guest, event } = context
    const photosSent = await photoRepository.countByGuest(guest.id)

    return {
      guest: { id: guest.id, name: guest.name },
      event: toGuestEventInfo(event),
      photosSent
    }
  }
)