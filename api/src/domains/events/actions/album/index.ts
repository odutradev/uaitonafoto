import mongoose from 'mongoose'
import defineAction from '@factories/defineAction'
import { buildPaginatedResponse, getPaginationOptions } from '@factories/pagination/utils'
import eventRepository from '../../repositories/events'
import guestRepository from '../../repositories/guests'
import likeRepository from '../../repositories/likes'
import photoRepository from '../../repositories/photos'
import screenSessionMiddleware from '../../middlewares/screenSession'
import { arePhotosVisible, getEventPhase, hasEventEnded } from '../../utils/eventWindows'
import { ensureCurrentEventPin, generatePin } from '../../utils/eventPin'
import { loadTeamAccess } from '../../utils/loadTeamAccess'
import { removePhotoFile } from '../../utils/photoStorage'
import { signScreenToken } from '../../utils/screenToken'
import toPhotoResponses from '../photo/utils/toPhotoResponses'
import {
  activateScreenResponseSchema,
  activateScreenSchema,
  albumQuerySchema,
  albumResponseSchema,
  createScreenSlotSchema,
  eventGuestListResponseSchema,
  eventIdParamsSchema,
  eventPhotoParamsSchema,
  eventScreenParamsSchema,
  screenQuerySchema,
  screenResponseSchema,
  screenSlotListResponseSchema
} from './schemas'
import { photoSchema } from '../photo/schemas'

import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type { PhotoResponse } from '../photo/types'
import type {
  ActivateScreenRequest,
  ActivateScreenResponse,
  AlbumRequest,
  AlbumResponse,
  CreateScreenSlotRequest,
  EventGuestListResponse,
  EventIdRequest,
  EventPhotoRequest,
  EventScreenRequest,
  ScreenRequest,
  ScreenResponse,
  ScreenSlotListResponse
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
  async ({ params, data, manageError }: ManageRequestBody<ActivateScreenRequest>): ManageRequestResponse<ActivateScreenResponse> => {
    const foundEvent = await eventRepository.findById(params.id)
    if (!foundEvent) return manageError({ code: 'not_found' })
    if (getEventPhase(foundEvent) === 'expired') {
      return manageError({ code: 'forbidden', details: 'A galeria deste evento já foi encerrada.' })
    }

    const slot = foundEvent.screens.find((item) => item.pin === data.pin)
    if (!slot) {
      return manageError({ code: 'forbidden', details: 'PIN do telão incorreto.' })
    }

    if (slot.activatedAt) {
      return manageError({
        code: 'conflict',
        details: 'Este PIN já está ativo em outro telão. Gere outro PIN ou desconecte o telão no painel.'
      })
    }

    const activatedEvent = await eventRepository.activateScreenSlot(foundEvent.id, slot.id, new Date().toISOString())
    const event = await ensureCurrentEventPin(activatedEvent ?? foundEvent)

    return {
      screenToken: signScreenToken(event.id, slot.id, event.galleryExpiresAt),
      event: {
        id: event.id,
        name: event.name,
        guestToken: event.guestToken
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

    const foundEvent = await eventRepository.findById(params.id)
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
        guestToken: event.guestToken
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
    summary: 'Álbum do evento para a equipe, disponível após o término (perspectiva dos convidados)',
    tags: ['Álbum e Telão'],
    authenticate: true,
    schema: { params: eventIdParamsSchema, query: albumQuerySchema },
    responses: {
      200: { description: 'Fotos paginadas, mais recentes primeiro', schema: albumResponseSchema },
      403: { description: 'Sem acesso ou evento ainda não terminou' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ ids, params, query, manageError }: ManageRequestBody<AlbumRequest>): ManageRequestResponse<AlbumResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })
    if (!hasEventEnded(access.event)) return manageError({ code: 'forbidden', details: 'O álbum abre após o término do evento' })

    const { page, limit, offset } = getPaginationOptions(query)
    const result = await photoRepository.listByEvent({
      eventId: access.event.id,
      guestId: query?.guestId,
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

    return response
  }
)
