import mongoose from 'mongoose'
import { randomUUID } from 'crypto'
import { ZipArchive } from 'archiver'
import defineAction from '@factories/defineAction'
import { getStorageFile } from '@firebase/services/storage'
import { buildPaginatedResponse, getPaginationOptions } from '@factories/pagination/utils'
import eventRepository from '../../repositories/events'
import guestRepository from '../../repositories/guests'
import likeRepository from '../../repositories/likes'
import photoRepository from '../../repositories/photos'
import screenSessionMiddleware from '../../middlewares/screenSession'
import { arePhotosVisible, getEventPhase, hasEventEnded } from '../../utils/eventWindows'
import { broadcastEvent, subscribeEventStream } from '@realtime'
import { ensureCurrentEventPin, generatePin } from '../../utils/eventPin'
import { checkPinLockout, recordPinFailure, resetPinLockout, resetPinLockoutsForTarget } from '../../utils/pinLockout'
import { removePhotoFile } from '../../utils/photoStorage'
import { signScreenToken } from '../../utils/screenToken'
import { toPhotoResponses } from '../photo'
import { findMemberRole } from '../event'
import type { TeamAccess } from '../../utils/types'
import type { EventChallenge, EventType } from '../../repositories/events/types'

const DEFAULT_CHALLENGES_BY_TYPE: Record<EventType, string[]> = {
  wedding: [
    'Foto com o padrinho ou madrinha mais animado 🕺',
    'O brinde mais bonito da sua mesa 🥂',
    'Flagra dos noivos apaixonados 💍',
    'O melhor passinho na pista de dança 💃',
    'Selfie com alguém da família dos noivos 👨‍👩‍👧',
    'Foto do doce ou prato mais gostoso da festa 🍰',
    'Foto com o convidado mais elegante da noite ✨'
  ],
  birthday: [
    'Foto fazendo careta com o aniversariante 🤪',
    'O abraço mais apertado da festa 🫂',
    'Flagra na hora de cantar o Parabéns 🎂',
    'A pose mais engraçada da sua mesa 📸',
    'Brinde com copo cheio ao aniversariante! 🍻',
    'Foto do look mais estiloso da festa 🕶️',
    'Selfie com 4 pessoas sorrindo 😁'
  ],
  corporate: [
    'Selfie criativa com o seu time 💼',
    'Foto de networking: com alguém que acabou de conhecer 🤝',
    'Foto fazendo a pose executiva mais marcante 👔',
    'Foto da equipe brindando ao sucesso do evento 🥂',
    'Foto em frente ao painel ou logo oficial do evento 🏢',
    'O sorriso mais contagiante da empresa ⭐',
    'Selfie com alguém de outro departamento 🚀'
  ],
  other: [
    'A foto mais animada da galera reunida 🎉',
    'A melhor gargalhada flagrada no evento 😂',
    'Foto do brinde mais épico da noite 🍹',
    'A pose mais criativa da festa 🕺',
    'Selfie com pessoas de mesas diferentes 🤝',
    'Foto do detalhe mais bonito da decoração 🌺',
    'Foto do momento mais emocionante da noite ❤️'
  ]
}

const buildDefaultChallenges = (eventType: EventType): EventChallenge[] => {
  const titles = DEFAULT_CHALLENGES_BY_TYPE[eventType] || DEFAULT_CHALLENGES_BY_TYPE.other
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
import {
  activateScreenResponseSchema,
  activateScreenSchema,
  addChallengeSchema,
  albumQuerySchema,
  albumResponseSchema,
  approveAllPhotosResponseSchema,
  challengeListResponseSchema,
  challengeParamsSchema,
  createScreenSlotSchema,
  eventGuestListResponseSchema,
  eventIdParamsSchema,
  eventPhotoParamsSchema,
  eventScreenParamsSchema,
  resetEventLockoutsResponseSchema,
  resetEventLockoutsSchema,
  screenQuerySchema,
  screenResponseSchema,
  screenSlotListResponseSchema,
  updateScreenSlotSchema
} from './schemas'
import { photoSchema } from '../photo/schemas'

import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type { PhotoResponse } from '../photo/types'
import type {
  ActivateScreenRequest,
  ActivateScreenResponse,
  AddChallengeRequest,
  AlbumRequest,
  AlbumResponse,
  ApproveAllPhotosResponse,
  ChallengeListResponse,
  ChallengeParamsRequest,
  CreateScreenSlotRequest,
  EventGuestListResponse,
  EventIdRequest,
  EventPhotoRequest,
  EventScreenRequest,
  ResetEventLockoutsRequest,
  ResetEventLockoutsResponse,
  ScreenRequest,
  ScreenResponse,
  ScreenSlotListResponse,
  UpdateScreenSlotRequest
} from './types'

const SCREEN_DEFAULT_LIMIT = 50
const MAX_ACTIVE_SCREENS = 2

export const createScreenSlot = defineAction(
  {
    method: 'post',
    path: '/events/:id/screens',
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

    if (access.event.screens.length >= MAX_ACTIVE_SCREENS) {
      return manageError({
        code: 'conflict',
        details: 'Limite de 2 telões atingido. Desconecte um telão para gerar um novo PIN.'
      })
    }

    const existingPins = [access.event.settings.pin, ...access.event.screens.map((s) => s.pin)]
    const trimmedName = data?.name?.trim()
    const slot = {
      id: new mongoose.Types.ObjectId().toString(),
      ...(trimmedName ? { name: trimmedName } : {}),
      pin: generatePin(existingPins),
      createdAt: new Date().toISOString()
    }

    const updated = await eventRepository.addScreenSlot(access.event.id, slot, MAX_ACTIVE_SCREENS)
    if (!updated) {
      return manageError({
        code: 'conflict',
        details: 'Limite de 2 telões atingido. Desconecte um telão para gerar um novo PIN.'
      })
    }

    return updated.screens
  }
)

export const removeScreenSlot = defineAction(
  {
    method: 'delete',
    path: '/events/:id/screens/:screenId',
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

    const updated = await eventRepository.removeScreenSlot(access.event.id, params.screenId)
    if (!updated) return manageError({ code: 'not_found' })

    return updated.screens
  }
)

export const updateScreenSlot = defineAction(
  {
    method: 'patch',
    path: '/events/:id/screens/:screenId',
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
    const event = await ensureCurrentEventPin(activatedEvent ?? foundEvent)

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
    path: '/events/:id/screen',
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
    if (!arePhotosVisible(foundEvent)) return manageError({ code: 'forbidden', details: 'Fotos ainda não liberadas' })

    const event = await ensureCurrentEventPin(foundEvent)

    await eventRepository.touchScreenLastSeen(event.id, ids.screenId, new Date().toISOString())

    const photos = await photoRepository.listSince({
      eventId: event.id,
      since: query?.since,
      limit: query?.limit ?? SCREEN_DEFAULT_LIMIT
    })

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

export const getAlbum = defineAction(
  {
    method: 'get',
    path: '/events/:id/album',
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
    path: '/events/:id/guests',
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
      createdAt: guest.createdAt
    }))
  }
)

export const deleteEventPhoto = defineAction(
  {
    method: 'delete',
    path: '/events/:id/photos/:photoId',
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
      for (const res of responses) {
        broadcastEvent(access.event.id, 'photo:new', res)
        broadcastEvent(access.event.id, 'photo:moderated', { photoId: res.id, status: 'approved' })
      }
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
    if (!arePhotosVisible(foundEvent)) return manageError({ code: 'forbidden', details: 'Fotos ainda não liberadas' })

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
    path: '/rooms/:id',
    summary: 'Canal SSE por sala de evento (/rooms/:eventId)',
    tags: ['Álbum e Telão'],
    schema: { params: eventIdParamsSchema },
    responses: {
      200: { description: 'Conexão SSE estabelecida por sala de evento' },
      403: { description: 'Fotos ainda não liberadas' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ defaultExpress, params, manageError }: ManageRequestBody<EventIdRequest>): ManageRequestResponse<void> => {
    const foundEvent = await eventRepository.findByIdOrGuestToken(params.id)
    if (!foundEvent) return manageError({ code: 'not_found' })
    if (!arePhotosVisible(foundEvent)) return manageError({ code: 'forbidden', details: 'Fotos ainda não liberadas' })

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

    broadcastEvent(event.id, 'lockout:reset', {
      scope,
      eventId: event.id,
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

    archive.on('error', (err: any) => {
      if (!res.headersSent) {
        manageError({ code: 'internal_error', error: err })
      } else {
        res.end()
      }
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
    path: '/events/:id/challenges',
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
    let challenges = event.challenges ?? []

    if (challenges.length === 0) {
      challenges = buildDefaultChallenges(event.type)
      await eventRepository.update(event.id, { challenges })
    }

    return challenges
  }
)

export const addEventChallenge = defineAction(
  {
    method: 'post',
    path: '/events/:id/challenges',
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
    path: '/events/:id/challenges/:challengeId',
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
