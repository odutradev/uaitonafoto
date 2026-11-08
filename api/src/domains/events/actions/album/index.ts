import defineAction from '@factories/defineAction'
import { buildPaginatedResponse, getPaginationOptions } from '@factories/pagination/utils'
import guestRepository from '../../repositories/guests'
import likeRepository from '../../repositories/likes'
import photoRepository from '../../repositories/photos'
import { arePhotosVisible, hasEventEnded } from '../../utils/eventWindows'
import { loadTeamAccess } from '../../utils/loadTeamAccess'
import { removePhotoFile } from '../../utils/photoStorage'
import toPhotoResponses from '../photo/utils/toPhotoResponses'
import {
  albumQuerySchema,
  albumResponseSchema,
  eventGuestListResponseSchema,
  eventIdParamsSchema,
  eventPhotoParamsSchema,
  screenQuerySchema,
  screenResponseSchema
} from './schemas'
import { photoSchema } from '../photo/schemas'

import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type { PhotoResponse } from '../photo/types'
import type {
  AlbumRequest,
  AlbumResponse,
  EventGuestListResponse,
  EventIdRequest,
  EventPhotoRequest,
  ScreenRequest,
  ScreenResponse
} from './types'

const SCREEN_DEFAULT_LIMIT = 50

export const getScreen = defineAction(
  {
    method: 'get',
    path: '/events/:id/screen',
    summary: 'Fotos do telão (polling por cursor), respeitando a visibilidade configurada',
    tags: ['Álbum e Telão'],
    authenticate: true,
    schema: { params: eventIdParamsSchema, query: screenQuerySchema },
    responses: {
      200: { description: 'Novas fotos desde o cursor', schema: screenResponseSchema },
      403: { description: 'Sem acesso ou fotos ainda não liberadas' },
      404: { description: 'Evento não encontrado' }
    }
  },
  async ({ ids, params, query, manageError }: ManageRequestBody<ScreenRequest>): ManageRequestResponse<ScreenResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const access = await loadTeamAccess(params.id, ids.userId)
    if ('error' in access) return manageError({ code: access.error })
    if (!arePhotosVisible(access.event)) return manageError({ code: 'forbidden', details: 'Fotos ainda não liberadas' })

    const photos = await photoRepository.listSince({
      eventId: access.event.id,
      since: query?.since,
      limit: query?.limit ?? SCREEN_DEFAULT_LIMIT
    })

    return {
      photos: await toPhotoResponses(photos),
      nextSince: photos.at(-1)?.createdAt ?? query?.since
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
