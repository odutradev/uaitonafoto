import { guestEventInfoSchema, guestSessionResponseSchema, guestTokenParamsSchema, joinEventResponseSchema, joinEventSchema } from './schemas'
import { joinDeviceRateLimiter, joinEventRateLimiter } from '@domains/events/middlewares/guestRateLimit'
import { checkPinLockout, recordPinFailure, resetPinLockout } from '@domains/events/utils/pinLockout'
import guestSessionMiddleware from '@domains/events/middlewares/guestSession'
import { getClientIdentity } from '@domains/events/utils/clientIdentity'
import { ensureCurrentEventPin } from '@domains/events/utils/eventPin'
import { getEventPhase } from '@domains/events/utils/eventWindows'
import eventRepository from '@domains/events/repositories/events'
import guestRepository from '@domains/events/repositories/guests'
import photoRepository from '@domains/events/repositories/photos'
import { signGuestToken } from '@domains/events/utils/guestToken'
import defineAction from '@factories/defineAction'

import type { GetGuestEventRequest, GuestEventInfo, GuestSessionResponse, JoinEventRequest, JoinEventResponse } from './types'
import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type { EventEntity } from '@domains/events/repositories/events/types'
import type { GuestEntity } from '@domains/events/repositories/guests/types'

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
  challengesMode: event.settings.challengesMode ?? 'choose',
  challenges: event.settings.challengesEnabled
    ? (event.challenges?.filter((c) => c.active) ?? [])
    : [],
  phase: getEventPhase(event)
})

export const getGuestEvent = defineAction(
  {
    method: 'get',
    path: '/guest/events/:token/details',
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
    middlewares: [joinEventRateLimiter, joinDeviceRateLimiter],
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

    const client = getClientIdentity(defaultExpress.req)

    const existingGuest = await guestRepository.findExistingGuestForClient({
      eventId: event.id,
      deviceId: client.deviceId,
      fingerprint: client.fingerprint,
      ip: client.ip,
      name: data.name
    })

    if (existingGuest?.isBlocked) {
      return manageError({
        code: 'forbidden',
        details: 'Você foi bloqueado pela moderação deste evento.'
      })
    }

    const sessionData = {
      name: data.name.trim(),
      ip: client.ip,
      deviceId: client.deviceId,
      deviceFingerprint: client.fingerprint,
      userAgent: client.userAgent
    }

    const buildJoinResponse = (guest: GuestEntity, completedChallengeIds: string[]) => ({
      guestToken: signGuestToken(guest.id, event.galleryExpiresAt),
      guest: { id: guest.id, name: guest.name },
      event: toGuestEventInfo(event),
      completedChallengeIds
    })

    if (!existingGuest) {
      const createdGuest = await guestRepository.create({ eventId: event.id, ...sessionData })
      return buildJoinResponse(createdGuest, [])
    }

    const updatedGuest = await guestRepository.updateSession(existingGuest.id, sessionData)
    const guest = updatedGuest ?? existingGuest
    const completedChallengeIds = await photoRepository.findCompletedChallengeIdsByGuest(guest.id)
    return buildJoinResponse(guest, completedChallengeIds)
  }
)

export const getGuestSession = defineAction(
  {
    method: 'get',
    path: '/guest/me/details',
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
    const [photosSent, completedChallengeIds] = await Promise.all([
      photoRepository.countByGuest(guest.id),
      photoRepository.findCompletedChallengeIdsByGuest(guest.id)
    ])

    return {
      guest: { id: guest.id, name: guest.name },
      event: toGuestEventInfo(event),
      photosSent,
      completedChallengeIds
    }
  }
)