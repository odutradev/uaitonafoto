import { ZipArchive } from 'archiver'
import { randomUUID } from 'crypto'
import mongoose from 'mongoose'

import { activateScreenResponseSchema, activateScreenSchema, addChallengeSchema, albumQuerySchema, albumResponseSchema, approveAllPhotosResponseSchema, challengeListResponseSchema, challengeParamsSchema, createScreenSlotSchema, deleteEventGuestResponseSchema, disconnectScreenResponseSchema, eventGuestListResponseSchema, eventGuestParamsSchema, eventGuestSchema, eventIdParamsSchema, eventPhotoParamsSchema, eventScreenParamsSchema, resetEventLockoutsResponseSchema, resetEventLockoutsSchema, screenQuerySchema, screenResponseSchema, screenSlotListResponseSchema, setEventGuestBlockSchema, setScreenSlotBlockSchema, updateEventGuestSchema, updateScreenSlotSchema } from './schemas'
import { checkPinLockout, recordPinFailure, resetPinLockout, resetPinLockoutsForTarget } from '@domains/events/utils/pinLockout'
import { arePhotosVisible, getEventPhase, hasEventEnded } from '@domains/events/utils/eventWindows'
import { buildPaginatedResponse, getPaginationOptions } from '@factories/pagination/utils'
import { ensureCurrentEventPin, generatePin } from '@domains/events/utils/eventPin'
import screenSessionMiddleware from '@domains/events/middlewares/screenSession'
import { resolveEventLimits } from '@domains/events/utils/eventLimits'
import { removePhotoFile } from '@domains/events/utils/photoStorage'
import { signScreenToken } from '@domains/events/utils/screenToken'
import { photoSchema } from '@domains/events/actions/photo/schemas'
import eventRepository from '@domains/events/repositories/events'
import guestRepository from '@domains/events/repositories/guests'
import photoRepository from '@domains/events/repositories/photos'
import challengesData from '@domains/events/data/challenges.json'
import { broadcastEvent, subscribeEventStream } from '@realtime'
import { toPhotoResponses } from '@domains/events/actions/photo'
import likeRepository from '@domains/events/repositories/likes'
import { findMemberRole } from '@domains/events/actions/event'
import { getStorageFile } from '@firebase/services/storage'
import defineAction from '@factories/defineAction'

import type { ActivateScreenRequest, ActivateScreenResponse, AddChallengeRequest, AlbumRequest, AlbumResponse, ApproveAllPhotosResponse, ChallengeListResponse, ChallengeParamsRequest, CreateScreenSlotRequest, DeleteEventGuestResponse, DisconnectScreenResponse, EventGuestListResponse, EventGuestParamsRequest, EventGuestResponse, EventIdRequest, EventPhotoRequest, EventScreenRequest, ResetEventLockoutsRequest, ResetEventLockoutsResponse, ScreenRequest, ScreenResponse, ScreenSlotListResponse, SetEventGuestBlockRequest, SetScreenSlotBlockRequest, UpdateEventGuestRequest, UpdateScreenSlotRequest } from './types'
import type { EventChallenge, EventScreenHistoryEntry, EventScreenSlot, EventType } from '@domains/events/repositories/events/types'
import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type { PhotoResponse } from '@domains/events/actions/photo/types'
import type { TeamAccess } from '@domains/events/utils/types'

const DefaultChallengesByType: Record<EventType, string[]> = challengesData as Record<EventType, string[]>

const buildDefaultChallenges = (eventType: EventType): EventChallenge[] => {
  const titles = DefaultChallengesByType[eventType] || DefaultChallengesByType.other
  return titles.map((title) => ({
    id: randomUUID(),
    title,
    active: true,
    createdAt: new Date().toISOString()
  }))
}

const loadTeamAccess = async (eventId: string, userId: string): Promise<TeamAccess> => {
  const event = await eventRepository.findById(eventId)
  if (!event) return { error: 'not_found' }

  const role = findMemberRole(event, userId)
  return role ? { event, role } : { error: 'forbidden' }
}

const ScreenDefaultLimit = 50
const MaxActiveScreens = 2

export const createScreenSlot = defineAction(
  {
    method: 'post',
    path: '/events/:id/screens/create',
    summary: 'Gerar um novo PIN de telão para o evento (máximo de 2 telões ativos)',
    tags: ['Álbum e Telão'],
    authenticate: true,
    schema: { params: eventIdParamsSchema, body: createScreenSlotSchema },
    responses: {
      200: { description: 'Lista atualizada de telões do evento', schema: screenSlotListResponseSchema },
      403: { description: 'Usuário não pertence à equipe do evento' },
      404: { description: 'Evento não encontrado' },
      409: { description: 'Limite máximo de 2 telões atingido' }
    }
  },
  async ({ ids, params, data, manageError }: ManageRequestBody<CreateScreenSlotRequest>): ManageRequestResponse<ScreenSlotListResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })

    const { maxScreens } = await resolveEventLimits(access.event)

    if (access.event.screens.length >= maxScreens) {
      return manageError({
        code: 'conflict',
        details: `Limite de ${maxScreens} telões atingido para este evento. Desconecte um telão para gerar um novo PIN.`
      })
    }

    const existingPins = [access.event.settings.pin, ...access.event.screens.map((s) => s.pin)]
    const trimmedName = data?.name?.trim()
    const slot: EventScreenSlot = {
      id: new mongoose.Types.ObjectId().toString(),
      ...(trimmedName ? { name: trimmedName } : {}),
      pin: generatePin(existingPins),
      createdAt: new Date().toISOString(),
      isBlocked: false
    }

    const updated = await eventRepository.addScreenSlot(access.event.id, slot, maxScreens)
    if (!updated) {
      return manageError({
        code: 'conflict',
        details: `Limite de ${maxScreens} telões atingido para este evento. Desconecte um telão para gerar um novo PIN.`
      })
    }

    const historyEntry: EventScreenHistoryEntry = {
      id: randomUUID(),
      screenId: slot.id,
      name: slot.name,
      action: 'created',
      timestamp: new Date().toISOString()
    }
    await eventRepository.addScreenHistory(access.event.id, historyEntry)

    broadcastEvent(access.event.id, 'screen:create', {
      slot,
      screens: updated.screens,
      historyEntry
    })

    return updated.screens
  }
)

export const removeScreenSlot = defineAction(
  {
    method: 'delete',
    path: '/events/:id/screens/:screenId/remove',
    summary: 'Desconectar e remover um telão do evento',
    tags: ['Álbum e Telão'],
    authenticate: true,
    schema: { params: eventScreenParamsSchema },
    responses: {
      200: { description: 'Lista atualizada de telões do evento', schema: screenSlotListResponseSchema },
      403: { description: 'Usuário não pertence à equipe do evento' },
      404: { description: 'Evento ou telão não encontrado' }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<EventScreenRequest>): ManageRequestResponse<ScreenSlotListResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })

    const slot = access.event.screens.find((s) => s.id === params.screenId)
    const updated = await eventRepository.removeScreenSlot(access.event.id, params.screenId)
    if (!updated) return manageError({ code: 'not_found' })

    const historyEntry: EventScreenHistoryEntry = {
      id: randomUUID(),
      screenId: params.screenId,
      name: slot?.name,
      action: 'deleted',
      timestamp: new Date().toISOString()
    }
    await eventRepository.addScreenHistory(access.event.id, historyEntry)

    broadcastEvent(access.event.id, 'screen:disconnect', {
      screenId: params.screenId,
      screens: updated.screens,
      historyEntry
    })

    return updated.screens
  }
)

export const updateScreenSlot = defineAction(
  {
    method: 'patch',
    path: '/events/:id/screens/:screenId/update',
    summary: 'Atualizar apelido ou identificação de um telão do evento',
    tags: ['Álbum e Telão'],
    authenticate: true,
    schema: { params: eventScreenParamsSchema, body: updateScreenSlotSchema },
    responses: {
      200: { description: 'Lista atualizada de telões do evento', schema: screenSlotListResponseSchema },
      403: { description: 'Usuário não pertence à equipe do evento' },
      404: { description: 'Evento ou telão não encontrado' }
    }
  },
  async ({ ids, params, data, manageError }: ManageRequestBody<UpdateScreenSlotRequest>): ManageRequestResponse<ScreenSlotListResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })

    const trimmedName = data?.name?.trim()
    const updated = await eventRepository.updateScreenSlotName(access.event.id, params.screenId, trimmedName || undefined)
    if (!updated) return manageError({ code: 'not_found' })

    const historyEntry: EventScreenHistoryEntry = {
      id: randomUUID(),
      screenId: params.screenId,
      name: trimmedName,
      action: 'updated',
      timestamp: new Date().toISOString()
    }
    await eventRepository.addScreenHistory(access.event.id, historyEntry)

    broadcastEvent(access.event.id, 'screen:update', {
      screenId: params.screenId,
      screens: updated.screens,
      historyEntry
    })

    return updated.screens
  }
)

export const setScreenSlotBlock = defineAction(
  {
    method: 'patch',
    path: '/events/:id/screens/:screenId/block',
    summary: 'Bloquear ou desbloquear um telão individualmente',
    tags: ['Álbum e Telão'],
    authenticate: true,
    schema: { params: eventScreenParamsSchema, body: setScreenSlotBlockSchema },
    responses: {
      200: { description: 'Lista atualizada de telões do evento', schema: screenSlotListResponseSchema },
      403: { description: 'Usuário não pertence à equipe do evento' },
      404: { description: 'Evento ou telão não encontrado' }
    }
  },
  async ({ ids, params, data, manageError }: ManageRequestBody<SetScreenSlotBlockRequest>): ManageRequestResponse<ScreenSlotListResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })

    const slot = access.event.screens.find((s) => s.id === params.screenId)
    if (!slot) return manageError({ code: 'not_found' })

    const shouldBlock = Boolean(data?.blocked)
    const updated = await eventRepository.setScreenSlotBlocked(access.event.id, params.screenId, shouldBlock)
    if (!updated) return manageError({ code: 'not_found' })

    if (!shouldBlock) {
      resetPinLockoutsForTarget([access.event.id, params.screenId], 'screen')
    }

    const historyEntry: EventScreenHistoryEntry = {
      id: randomUUID(),
      screenId: params.screenId,
      name: slot.name,
      action: shouldBlock ? 'blocked' : 'unblocked',
      timestamp: new Date().toISOString()
    }
    await eventRepository.addScreenHistory(access.event.id, historyEntry)

    broadcastEvent(access.event.id, shouldBlock ? 'screen:block' : 'screen:unblock', {
      screenId: params.screenId,
      screens: updated.screens,
      historyEntry
    })

    return updated.screens
  }
)

export const activateScreen = defineAction(
  {
    method: 'post',
    path: '/events/:id/screen/activate',
    summary: 'Ativar telão do evento informando o PIN gerado no painel e obter credencial de acesso',
    tags: ['Álbum e Telão'],
    rateLimit: { limit: 30 },
    schema: { params: eventIdParamsSchema, body: activateScreenSchema },
    responses: {
      200: { description: 'Telão ativado com sucesso', schema: activateScreenResponseSchema },
      403: { description: 'PIN inválido ou galeria encerrada' },
      404: { description: 'Evento não encontrado' },
      409: { description: 'PIN já utilizado em outro telão' }
    }
  },
  async ({ defaultExpress, params, data, manageError }: ManageRequestBody<ActivateScreenRequest>): ManageRequestResponse<ActivateScreenResponse> => {
    const foundEvent = await eventRepository.findByIdOrGuestToken(params.id)
    if (!foundEvent) return manageError({ code: 'not_found' })
    if (getEventPhase(foundEvent) === 'expired') {
      return manageError({ code: 'forbidden', details: 'A galeria deste evento já foi encerrada.' })
    }

    const lockoutStatus = checkPinLockout({
      scope: 'screen',
      targetId: foundEvent.id,
      req: defaultExpress.req,
      res: defaultExpress.res
    })
    if (lockoutStatus.isLocked) {
      return manageError({
        code: lockoutStatus.isPermanent ? 'forbidden' : 'too_many_requests',
        details: lockoutStatus.message
      })
    }

    const slot = foundEvent.screens.find((item) => item.pin === data.pin)
    if (!slot) {
      const failure = recordPinFailure({
        scope: 'screen',
        targetId: foundEvent.id,
        req: defaultExpress.req,
        res: defaultExpress.res
      })
      return manageError({
        code: failure.isPermanent ? 'forbidden' : failure.isLocked ? 'too_many_requests' : 'forbidden',
        details: failure.message
      })
    }

    if (slot.isBlocked) {
      return manageError({
        code: 'forbidden',
        details: 'Este telão foi bloqueado pela organização do evento.'
      })
    }

    if (slot.activatedAt) {
      return manageError({
        code: 'conflict',
        details: 'Este PIN já está ativo em outro telão. Gere outro PIN ou desconecte o telão no painel.'
      })
    }

    resetPinLockout({
      scope: 'screen',
      targetId: foundEvent.id,
      req: defaultExpress.req
    })

    const activatedEvent = await eventRepository.activateScreenSlot(foundEvent.id, slot.id, new Date().toISOString())
    const historyEntry: EventScreenHistoryEntry = {
      id: randomUUID(),
      screenId: slot.id,
      name: slot.name,
      action: 'connected',
      timestamp: new Date().toISOString()
    }
    const withHistory = await eventRepository.addScreenHistory(foundEvent.id, historyEntry)
    const event = await ensureCurrentEventPin(withHistory ?? activatedEvent ?? foundEvent)

    broadcastEvent(event.id, 'screen:activate', {
      screenId: slot.id,
      screens: event.screens,
      historyEntry
    })

    return {
      screenToken: signScreenToken(event.id, slot.id, event.galleryExpiresAt),
      event: {
        id: event.id,
        name: event.name,
        guestToken: event.guestToken,
        customization: event.customization
      },
      pin: event.settings.pinEnabled ? event.settings.pin : null
    }
  }
)

export const getScreen = defineAction(
  {
    method: 'get',
    path: '/events/:id/screen/details',
    summary: 'Fotos do telão (polling por cursor), autenticado pela credencial do telão',
    tags: ['Álbum e Telão'],
    middlewares: [screenSessionMiddleware],
    schema: { params: eventIdParamsSchema, query: screenQuerySchema },
    responses: {
      200: { description: 'Novas fotos desde o cursor', schema: screenResponseSchema },
      403: { description: 'Sem acesso ou fotos ainda não liberadas' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ ids, params, query, manageError }: ManageRequestBody<ScreenRequest>): ManageRequestResponse<ScreenResponse> => {
    if (!ids.screenId) return manageError({ code: 'unauthorized' })

    const foundEvent = await eventRepository.findByIdOrGuestToken(params.id)
    if (!foundEvent) return manageError({ code: 'not_found' })
    const photosVisible = arePhotosVisible(foundEvent)

    const event = await ensureCurrentEventPin(foundEvent)

    await eventRepository.touchScreenLastSeen(event.id, ids.screenId, new Date().toISOString())

    const photos = photosVisible
      ? await photoRepository.listSince({
          eventId: event.id,
          since: query?.since,
          limit: query?.limit ?? ScreenDefaultLimit
        })
      : []

    return {
      event: {
        id: event.id,
        name: event.name,
        guestToken: event.guestToken,
        customization: event.customization
      },
      photos: await toPhotoResponses(photos),
      nextSince: photos.at(-1)?.createdAt ?? query?.since,
      pin: event.settings.pinEnabled ? event.settings.pin : null
    }
  }
)

export const disconnectScreen = defineAction(
  {
    method: 'post',
    path: '/events/:id/screen/disconnect',
    summary: 'Desconectar telão e remover seu slot, liberando a vaga no evento',
    tags: ['Álbum e Telão'],
    middlewares: [screenSessionMiddleware],
    schema: { params: eventIdParamsSchema },
    responses: {
      200: { description: 'Telão desconectado e vaga liberada', schema: disconnectScreenResponseSchema },
      401: { description: 'Credencial do telão inválida ou expirada' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<EventIdRequest>): ManageRequestResponse<DisconnectScreenResponse> => {
    if (!ids.screenId) return manageError({ code: 'unauthorized' })

    const foundEvent = await eventRepository.findByIdOrGuestToken(params.id)
    if (!foundEvent) return manageError({ code: 'not_found' })

    const slot = foundEvent.screens.find((s) => s.id === ids.screenId)
    const updated = await eventRepository.removeScreenSlot(foundEvent.id, ids.screenId)

    const historyEntry: EventScreenHistoryEntry = {
      id: randomUUID(),
      screenId: ids.screenId,
      name: slot?.name,
      action: 'disconnected',
      timestamp: new Date().toISOString()
    }
    await eventRepository.addScreenHistory(foundEvent.id, historyEntry)

    broadcastEvent(foundEvent.id, 'screen:disconnect', {
      screenId: ids.screenId,
      screens: updated?.screens ?? [],
      historyEntry
    })

    return { disconnected: true }
  }
)

export const getAlbum = defineAction(
  {
    method: 'get',
    path: '/events/:id/album/list',
    summary: 'Álbum do evento para a equipe (fotos enviadas pelos convidados)',
    tags: ['Álbum e Telão'],
    authenticate: true,
    schema: { params: eventIdParamsSchema, query: albumQuerySchema },
    responses: {
      200: { description: 'Fotos paginadas, mais recentes primeiro', schema: albumResponseSchema },
      403: { description: 'Sem acesso' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ ids, params, query, manageError }: ManageRequestBody<AlbumRequest>): ManageRequestResponse<AlbumResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })

    const { page, limit, offset } = getPaginationOptions(query)
    const result = await photoRepository.listByEvent({
      eventId: access.event.id,
      guestId: query?.guestId,
      status: query?.status ?? 'all',
      limit,
      offset
    })

    return buildPaginatedResponse({ count: result.count, rows: await toPhotoResponses(result.rows) }, page, limit)
  }
)

export const listEventGuests = defineAction(
  {
    method: 'get',
    path: '/events/:id/guests/list',
    summary: 'Listar convidados do evento com a quantidade de fotos enviadas',
    tags: ['Álbum e Telão'],
    authenticate: true,
    schema: { params: eventIdParamsSchema },
    responses: {
      200: { description: 'Convidados do evento', schema: eventGuestListResponseSchema },
      403: { description: 'Usuário não pertence à equipe do evento' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<EventIdRequest>): ManageRequestResponse<EventGuestListResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })

    const [guests, counts] = await Promise.all([
      guestRepository.listByEvent(access.event.id),
      photoRepository.countByGuestsOfEvent(access.event.id)
    ])

    return guests.map((guest) => ({
      id: guest.id,
      name: guest.name,
      photosCount: counts[guest.id] ?? 0,
      isBlocked: Boolean(guest.isBlocked),
      ip: guest.ip,
      lastActiveAt: guest.lastActiveAt,
      createdAt: guest.createdAt
    }))
  }
)

export const updateEventGuest = defineAction(
  {
    method: 'patch',
    path: '/events/:id/guests/:guestId/update',
    summary: 'Atualizar nome de um convidado do evento',
    tags: ['Álbum e Telão'],
    authenticate: true,
    schema: { params: eventGuestParamsSchema, body: updateEventGuestSchema },
    responses: {
      200: { description: 'Convidado atualizado', schema: eventGuestSchema },
      403: { description: 'Usuário não pertence à equipe do evento' },
      404: { description: 'Evento ou convidado não encontrado' }
    }
  },
  async ({ ids, params, data, manageError }: ManageRequestBody<UpdateEventGuestRequest>): ManageRequestResponse<EventGuestResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })

    const guest = await guestRepository.findById(params.guestId)
    if (!guest || guest.eventId !== access.event.id) return manageError({ code: 'not_found' })

    const updated = await guestRepository.updateName(params.guestId, data.name.trim())
    if (!updated) return manageError({ code: 'not_found' })

    const count = await photoRepository.countByGuest(params.guestId)

    return {
      id: updated.id,
      name: updated.name,
      photosCount: count,
      isBlocked: Boolean(updated.isBlocked),
      ip: updated.ip,
      lastActiveAt: updated.lastActiveAt,
      createdAt: updated.createdAt
    }
  }
)

export const setEventGuestBlock = defineAction(
  {
    method: 'patch',
    path: '/events/:id/guests/:guestId/block',
    summary: 'Bloquear ou desbloquear um convidado individualmente',
    tags: ['Álbum e Telão'],
    authenticate: true,
    schema: { params: eventGuestParamsSchema, body: setEventGuestBlockSchema },
    responses: {
      200: { description: 'Status do convidado atualizado', schema: eventGuestSchema },
      403: { description: 'Usuário não pertence à equipe do evento' },
      404: { description: 'Evento ou convidado não encontrado' }
    }
  },
  async ({ ids, params, data, manageError }: ManageRequestBody<SetEventGuestBlockRequest>): ManageRequestResponse<EventGuestResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })

    const guest = await guestRepository.findById(params.guestId)
    if (!guest || guest.eventId !== access.event.id) return manageError({ code: 'not_found' })

    const shouldBlock = Boolean(data.blocked)
    const updated = await guestRepository.setBlocked(params.guestId, shouldBlock)
    if (!updated) return manageError({ code: 'not_found' })

    if (!shouldBlock) {
      resetPinLockoutsForTarget([access.event.id, params.guestId], 'guest')
    }

    const count = await photoRepository.countByGuest(params.guestId)

    return {
      id: updated.id,
      name: updated.name,
      photosCount: count,
      isBlocked: Boolean(updated.isBlocked),
      ip: updated.ip,
      lastActiveAt: updated.lastActiveAt,
      createdAt: updated.createdAt
    }
  }
)

export const deleteEventGuest = defineAction(
  {
    method: 'delete',
    path: '/events/:id/guests/:guestId/remove',
    summary: 'Remover um convidado do evento',
    tags: ['Álbum e Telão'],
    authenticate: true,
    schema: { params: eventGuestParamsSchema },
    responses: {
      200: { description: 'Convidado removido com sucesso', schema: deleteEventGuestResponseSchema },
      403: { description: 'Usuário não pertence à equipe do evento' },
      404: { description: 'Evento ou convidado não encontrado' }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<EventGuestParamsRequest>): ManageRequestResponse<DeleteEventGuestResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })

    const guest = await guestRepository.findById(params.guestId)
    if (!guest || guest.eventId !== access.event.id) return manageError({ code: 'not_found' })

    await guestRepository.deleteById(params.guestId)

    return { deleted: true }
  }
)

export const deleteEventPhoto = defineAction(
  {
    method: 'delete',
    path: '/events/:id/photos/:photoId/remove',
    summary: 'Remover foto do evento (moderação da equipe)',
    tags: ['Álbum e Telão'],
    authenticate: true,
    schema: { params: eventPhotoParamsSchema },
    responses: {
      200: { description: 'Foto removida', schema: photoSchema },
      403: { description: 'Usuário não pertence à equipe do evento' },
      404: { description: 'Evento ou foto não encontrados' }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<EventPhotoRequest>): ManageRequestResponse<PhotoResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })

    const photo = await photoRepository.findById(params.photoId)
    if (!photo || photo.eventId !== access.event.id) return manageError({ code: 'not_found' })

    const [response] = await toPhotoResponses([photo])

    await photoRepository.delete(photo.id)
    await Promise.all([likeRepository.deleteByPhoto(photo.id), removePhotoFile(photo.storagePath)])

    broadcastEvent(photo.eventId, 'photo:delete', { photoId: photo.id })

    return response
  }
)

export const approveEventPhoto = defineAction(
  {
    method: 'patch',
    path: '/events/:id/photos/:photoId/approve',
    summary: 'Aprovar foto na fila de moderação para exibição no telão',
    tags: ['Álbum e Telão'],
    authenticate: true,
    schema: { params: eventPhotoParamsSchema },
    responses: {
      200: { description: 'Foto aprovada', schema: photoSchema },
      403: { description: 'Usuário não pertence à equipe do evento' },
      404: { description: 'Evento ou foto não encontrados' }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<EventPhotoRequest>): ManageRequestResponse<PhotoResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })

    const photo = await photoRepository.findById(params.photoId)
    if (!photo || photo.eventId !== access.event.id) return manageError({ code: 'not_found' })

    const updated = await photoRepository.updateStatus(photo.id, 'approved')
    if (!updated) return manageError({ code: 'not_found' })

    const [response] = await toPhotoResponses([updated])

    broadcastEvent(access.event.id, 'photo:new', response)
    broadcastEvent(access.event.id, 'photo:moderated', { photoId: photo.id, status: 'approved' })

    return response
  }
)

export const rejectEventPhoto = defineAction(
  {
    method: 'patch',
    path: '/events/:id/photos/:photoId/reject',
    summary: 'Rejeitar foto na fila de moderação',
    tags: ['Álbum e Telão'],
    authenticate: true,
    schema: { params: eventPhotoParamsSchema },
    responses: {
      200: { description: 'Foto rejeitada', schema: photoSchema },
      403: { description: 'Usuário não pertence à equipe do evento' },
      404: { description: 'Evento ou foto não encontrados' }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<EventPhotoRequest>): ManageRequestResponse<PhotoResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })

    const photo = await photoRepository.findById(params.photoId)
    if (!photo || photo.eventId !== access.event.id) return manageError({ code: 'not_found' })

    const updated = await photoRepository.updateStatus(photo.id, 'rejected')
    if (!updated) return manageError({ code: 'not_found' })

    const [response] = await toPhotoResponses([updated])

    broadcastEvent(access.event.id, 'photo:moderated', { photoId: photo.id, status: 'rejected' })

    return response
  }
)

export const approveAllEventPhotos = defineAction(
  {
    method: 'post',
    path: '/events/:id/photos/approve-all',
    summary: 'Aprovar todas as fotos pendentes na fila de moderação',
    tags: ['Álbum e Telão'],
    authenticate: true,
    schema: { params: eventIdParamsSchema },
    responses: {
      200: { description: 'Todas as fotos aprovadas', schema: approveAllPhotosResponseSchema },
      403: { description: 'Usuário não pertence à equipe do evento' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<EventIdRequest>): ManageRequestResponse<ApproveAllPhotosResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })

    const approvedPhotos = await photoRepository.approveAllPending(access.event.id)
    if (approvedPhotos.length > 0) {
      const responses = await toPhotoResponses(approvedPhotos)
      responses.forEach((photoResponse) => {
        broadcastEvent(access.event.id, 'photo:new', photoResponse)
        broadcastEvent(access.event.id, 'photo:moderated', { photoId: photoResponse.id, status: 'approved' })
      })
    }

    return { approvedCount: approvedPhotos.length }
  }
)

export const streamScreen = defineAction(
  {
    method: 'get',
    path: '/events/:id/screen/stream',
    summary: 'Canal SSE em tempo real do telão',
    tags: ['Álbum e Telão'],
    middlewares: [screenSessionMiddleware],
    schema: { params: eventIdParamsSchema },
    responses: {
      200: { description: 'Conexão SSE estabelecida (Server-Sent Events)' },
      401: { description: 'Credencial do telão inválida' },
      403: { description: 'Fotos ainda não liberadas' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ defaultExpress, params, manageError }: ManageRequestBody<EventIdRequest>): ManageRequestResponse<void> => {
    const foundEvent = await eventRepository.findByIdOrGuestToken(params.id)
    if (!foundEvent) return manageError({ code: 'not_found' })

    subscribeEventStream({
      eventId: foundEvent.id,
      req: defaultExpress.req,
      res: defaultExpress.res
    })
  }
)

export const streamRoom = defineAction(
  {
    method: 'get',
    path: '/rooms/:id/stream',
    summary: 'Canal SSE por sala de evento (/rooms/:eventId)',
    tags: ['Álbum e Telão'],
    schema: { params: eventIdParamsSchema },
    responses: {
      200: { description: 'Conexão SSE estabelecida por sala de evento' },
      403: { description: 'Galeria encerrada' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ defaultExpress, params, manageError }: ManageRequestBody<EventIdRequest>): ManageRequestResponse<void> => {
    const foundEvent = await eventRepository.findByIdOrGuestToken(params.id)
    if (!foundEvent) return manageError({ code: 'not_found' })
    if (getEventPhase(foundEvent) === 'expired') {
      return manageError({ code: 'forbidden', details: 'A galeria deste evento já foi encerrada.' })
    }

    subscribeEventStream({
      eventId: foundEvent.id,
      req: defaultExpress.req,
      res: defaultExpress.res
    })
  }
)

export const resetEventLockouts = defineAction(
  {
    method: 'post',
    path: '/events/:id/lockout/reset',
    summary: 'Desbloquear manualmente dispositivos e telões bloqueados por tentativas incorretas de PIN',
    tags: ['Álbum e Telão'],
    authenticate: true,
    schema: { params: eventIdParamsSchema, body: resetEventLockoutsSchema },
    responses: {
      200: { description: 'Bloqueios resetados com sucesso', schema: resetEventLockoutsResponseSchema },
      401: { description: 'Não autorizado' },
      403: { description: 'Usuário não pertence à equipe do evento' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ ids, params, data, manageError }: ManageRequestBody<ResetEventLockoutsRequest>): ManageRequestResponse<ResetEventLockoutsResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })

    const event = access.event
    const scope = data?.scope ?? 'all'
    const targetIds = [event.id, event.guestToken]

    const clearedCount = resetPinLockoutsForTarget(targetIds, scope)

    const shouldRecordHistory = scope === 'all' || scope === 'screen'
    const historyEntry: EventScreenHistoryEntry | undefined = shouldRecordHistory
      ? {
          id: randomUUID(),
          screenId: event.id,
          name: 'Todos os telões',
          action: 'unblocked',
          timestamp: new Date().toISOString()
        }
      : undefined

    if (historyEntry) await eventRepository.addScreenHistory(event.id, historyEntry)

    broadcastEvent(event.id, 'lockout:reset', {
      scope,
      eventId: event.id,
      historyEntry,
      timestamp: new Date().toISOString()
    })

    return {
      success: true,
      clearedCount,
      message: 'Bloqueios de PIN resetados com sucesso.'
    }
  }
)

export const downloadAlbumZip = defineAction(
  {
    method: 'get',
    path: '/events/:id/album/download-zip',
    summary: 'Baixar todas as fotos do evento compactadas em arquivo .zip (disponível após término)',
    tags: ['Álbum e Telão'],
    authenticate: true,
    schema: { params: eventIdParamsSchema },
    responses: {
      200: { description: 'Arquivo .zip com todas as fotos do evento' },
      400: { description: 'Evento sem fotos' },
      401: { description: 'Não autorizado' },
      403: { description: 'Sem acesso ou evento ainda não terminou' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ defaultExpress, ids, params, manageError }: ManageRequestBody<EventIdRequest>): ManageRequestResponse<void> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })
    if (!hasEventEnded(access.event)) {
      return manageError({
        code: 'forbidden',
        details: 'O download do álbum completo fica disponível após o término do evento.'
      })
    }

    const photos = await photoRepository.findAllByEvent(access.event.id)
    if (photos.length === 0) {
      return manageError({ code: 'bad_request', details: 'Este evento não possui fotos para download.' })
    }

    const { res } = defaultExpress
    const sanitizedName = access.event.name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40)
    const filename = `${sanitizedName || 'evento'}_fotos.zip`

    res.setHeader('Content-Type', 'application/zip')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`
    )

    const archive = new ZipArchive({ zlib: { level: 5 } })

    archive.on('error', (err: Error) => {
      if (res.headersSent) return res.end()
      manageError({ code: 'internal_error', error: err })
    })

    archive.pipe(res)

    const guestIds = [...new Set(photos.map((p) => p.guestId))]
    const guests = await guestRepository.findByIds(guestIds)
    const guestNames = new Map(guests.map((g) => [g.id, g.name.replace(/[^a-zA-Z0-9_-]/g, '_')]))

    photos.forEach((photo, index) => {
      const extension = photo.contentType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg'
      const guestName = guestNames.get(photo.guestId) || 'Convidado'
      const paddedIndex = (index + 1).toString().padStart(3, '0')
      const entryName = `${paddedIndex}_${guestName}_${photo.id}.${extension}`

      const readStream = getStorageFile(photo.storagePath).createReadStream()
      archive.append(readStream, { name: entryName })
    })

    await archive.finalize()
  }
)

export const getEventChallenges = defineAction(
  {
    method: 'get',
    path: '/events/:id/challenges/list',
    summary: 'Listar missões e desafios fotográficos do evento',
    tags: ['Gamificação & Desafios'],
    authenticate: true,
    schema: { params: eventIdParamsSchema },
    responses: {
      200: { description: 'Lista de desafios', schema: challengeListResponseSchema },
      403: { description: 'Usuário não pertence à equipe do evento' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<EventIdRequest>): ManageRequestResponse<ChallengeListResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })

    const event = access.event
    const storedChallenges = event.challenges ?? []
    if (storedChallenges.length > 0) return storedChallenges

    const challenges = buildDefaultChallenges(event.type)
    await eventRepository.update(event.id, { challenges })
    return challenges
  }
)

export const addEventChallenge = defineAction(
  {
    method: 'post',
    path: '/events/:id/challenges/create',
    summary: 'Adicionar nova missão fotográfica ao evento',
    tags: ['Gamificação & Desafios'],
    authenticate: true,
    schema: { params: eventIdParamsSchema, body: addChallengeSchema },
    responses: {
      200: { description: 'Desafios atualizados', schema: challengeListResponseSchema },
      403: { description: 'Usuário não pertence à equipe do evento' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ ids, params, data, manageError }: ManageRequestBody<AddChallengeRequest>): ManageRequestResponse<ChallengeListResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })

    const currentChallenges = access.event.challenges ?? (buildDefaultChallenges(access.event.type))
    const newChallenge = {
      id: randomUUID(),
      title: data.title.trim(),
      description: data.description?.trim(),
      active: true,
      createdAt: new Date().toISOString()
    }

    const nextChallenges = [...currentChallenges, newChallenge]
    await eventRepository.update(access.event.id, { challenges: nextChallenges })

    return nextChallenges
  }
)

export const deleteEventChallenge = defineAction(
  {
    method: 'delete',
    path: '/events/:id/challenges/:challengeId/remove',
    summary: 'Remover missão fotográfica do evento',
    tags: ['Gamificação & Desafios'],
    authenticate: true,
    schema: { params: challengeParamsSchema },
    responses: {
      200: { description: 'Desafios atualizados', schema: challengeListResponseSchema },
      403: { description: 'Usuário não pertence à equipe do evento' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<ChallengeParamsRequest>): ManageRequestResponse<ChallengeListResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })

    const currentChallenges = access.event.challenges ?? []
    const nextChallenges = currentChallenges.filter((c) => c.id !== params.challengeId)

    await eventRepository.update(access.event.id, { challenges: nextChallenges })

    return nextChallenges
  }
)

export const toggleEventChallenge = defineAction(
  {
    method: 'patch',
    path: '/events/:id/challenges/:challengeId/toggle',
    summary: 'Ativar ou desativar missão fotográfica do evento',
    tags: ['Gamificação & Desafios'],
    authenticate: true,
    schema: { params: challengeParamsSchema },
    responses: {
      200: { description: 'Desafios atualizados', schema: challengeListResponseSchema },
      403: { description: 'Usuário não pertence à equipe do evento' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<ChallengeParamsRequest>): ManageRequestResponse<ChallengeListResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })

    const currentChallenges = access.event.challenges ?? []
    const nextChallenges = currentChallenges.map((c) =>
      c.id === params.challengeId ? { ...c, active: !c.active } : c
    )

    await eventRepository.update(access.event.id, { challenges: nextChallenges })

    return nextChallenges
  }
)

export const resetEventChallenges = defineAction(
  {
    method: 'post',
    path: '/events/:id/challenges/reset',
    summary: 'Restaurar missões fotográficas padrão do tipo de evento',
    tags: ['Gamificação & Desafios'],
    authenticate: true,
    schema: { params: eventIdParamsSchema },
    responses: {
      200: { description: 'Desafios restaurados', schema: challengeListResponseSchema },
      403: { description: 'Usuário não pertence à equipe do evento' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<EventIdRequest>): ManageRequestResponse<ChallengeListResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })

    const defaultChallenges = buildDefaultChallenges(access.event.type)
    await eventRepository.update(access.event.id, { challenges: defaultChallenges })

    return defaultChallenges
  }
)
