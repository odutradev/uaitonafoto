import { Types } from 'mongoose'

import defineAction from '@factories/defineAction'
import upload from '@middlewares/upload'
import { buildPaginatedResponse, getPaginationOptions } from '@factories/pagination/utils'
import photoRepository from '../../repositories/photos'
import likeRepository from '../../repositories/likes'
import guestSessionMiddleware from '../../middlewares/guestSession'
import { detectImageType } from '../../utils/detectImageType'
import { arePhotosVisible, canUploadPhotos, getEventPhase } from '../../utils/eventWindows'
import { broadcastEvent } from '../../utils/eventStream'
import { loadGuestContext } from '../../utils/loadGuestContext'
import { removePhotoFile, storeEventPhoto } from '../../utils/photoStorage'
import toPhotoResponses from './utils/toPhotoResponses'
import {
  likeResponseSchema,
  listFeedQuerySchema,
  listFeedResponseSchema,
  photoParamsSchema,
  photoSchema
} from './schemas'

import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type {
  LikeResponse,
  ListFeedRequest,
  ListFeedResponse,
  PhotoParamsRequest,
  PhotoResponse
} from './types'

export const uploadPhoto = defineAction(
  {
    method: 'post',
    path: '/guest/photos',
    summary: 'Enviar foto para o evento (convidado)',
    tags: ['Fotos'],
    rateLimit: { limit: 60 },
    middlewares: [guestSessionMiddleware, upload.single('file')],
    requestFormat: 'multipart',
    uploadFieldName: 'file',
    responses: {
      200: { description: 'Foto enviada', schema: photoSchema },
      403: { description: 'Envio de fotos fechado para este evento' }
    }
  },
  async ({ ids, file, data, defaultExpress, manageError }: ManageRequestBody): ManageRequestResponse<PhotoResponse> => {
    if (!ids.guestId) return manageError({ code: 'unauthorized' })

    const context = await loadGuestContext(ids.guestId)
    if (!context) return manageError({ code: 'user_not_found' })

    const { guest, event } = context
    if (!canUploadPhotos(event)) {
      return manageError({ code: 'forbidden', details: `Envio de fotos indisponível (${getEventPhase(event)})` })
    }

    if (!file) return manageError({ code: 'bad_request', details: 'Arquivo de imagem obrigatório (campo "file")' })

    const rawCapturedAt = (data as Record<string, unknown> | undefined)?.capturedAt ?? defaultExpress?.req?.body?.capturedAt
    if (rawCapturedAt) {
      const capturedAt = Number(rawCapturedAt)
      if (!Number.isNaN(capturedAt)) {
        const ageMs = Date.now() - capturedAt
        const MAX_CAPTURE_AGE_MS = 10 * 60 * 1000
        const MAX_FUTURE_TOLERANCE_MS = 2 * 60 * 1000

        if (ageMs > MAX_CAPTURE_AGE_MS || ageMs < -MAX_FUTURE_TOLERANCE_MS) {
          return manageError({
            code: 'bad_request',
            details: 'Apenas fotos tiradas na hora com a câmera são permitidas. Não é possível enviar fotos antigas.'
          })
        }
      }
    }

    const imageType = detectImageType(file.buffer)
    if (!imageType) return manageError({ code: 'bad_request', details: 'Conteúdo do arquivo não é uma imagem válida' })

    const photoId = new Types.ObjectId().toString()
    const stored = await storeEventPhoto({
      eventId: event.id,
      photoId,
      extension: imageType.extension,
      buffer: file.buffer,
      contentType: imageType.contentType
    })

    const isModerationOn = Boolean(event.settings.moderationEnabled)

    const rawChallengeId = (data as Record<string, unknown> | undefined)?.challengeId ?? defaultExpress?.req?.body?.challengeId
    const rawChallengeTitle = (data as Record<string, unknown> | undefined)?.challengeTitle ?? defaultExpress?.req?.body?.challengeTitle

    const challengeId = typeof rawChallengeId === 'string' && rawChallengeId.trim() ? rawChallengeId.trim() : undefined
    const challengeTitle = typeof rawChallengeTitle === 'string' && rawChallengeTitle.trim() ? rawChallengeTitle.trim() : undefined

    try {
      const photo = await photoRepository.create({
        id: photoId,
        eventId: event.id,
        guestId: guest.id,
        storagePath: stored.path,
        url: stored.publicUrl,
        contentType: stored.contentType,
        size: stored.size,
        status: isModerationOn ? 'pending' : 'approved',
        challengeId,
        challengeTitle
      })

      const [response] = await toPhotoResponses([photo], guest.id)
      if (isModerationOn) {
        broadcastEvent(event.id, 'photo:pending', response)
      } else {
        broadcastEvent(event.id, 'photo:new', response)
      }
      return response
    } catch (error) {
      await removePhotoFile(stored.path)
      return manageError({ code: 'internal_error', error })
    }
  }
)

export const listFeed = defineAction(
  {
    method: 'get',
    path: '/guest/feed',
    summary: 'Listar feed de fotos do evento (convidado)',
    tags: ['Fotos'],
    middlewares: [guestSessionMiddleware],
    schema: { query: listFeedQuerySchema },
    responses: {
      200: { description: 'Feed paginado, mais recentes primeiro', schema: listFeedResponseSchema },
      403: { description: 'Fotos ainda não estão visíveis ou galeria encerrada' }
    }
  },
  async ({ ids, query, manageError }: ManageRequestBody<ListFeedRequest>): ManageRequestResponse<ListFeedResponse> => {
    if (!ids.guestId) return manageError({ code: 'unauthorized' })

    const context = await loadGuestContext(ids.guestId)
    if (!context) return manageError({ code: 'user_not_found' })
    if (!arePhotosVisible(context.event)) return manageError({ code: 'forbidden', details: 'Fotos indisponíveis no momento' })

    const { page, limit, offset } = getPaginationOptions(query)
    const result = await photoRepository.listByEvent({
      eventId: context.event.id,
      status: 'approved',
      limit,
      offset
    })

    return buildPaginatedResponse(
      { count: result.count, rows: await toPhotoResponses(result.rows, ids.guestId) },
      page,
      limit
    )
  }
)

export const toggleLike = defineAction(
  {
    method: 'post',
    path: '/guest/photos/:id/like',
    summary: 'Curtir ou descurtir uma foto (alterna)',
    tags: ['Fotos'],
    rateLimit: { limit: 300 },
    middlewares: [guestSessionMiddleware],
    schema: { params: photoParamsSchema },
    responses: {
      200: { description: 'Estado atual da curtida', schema: likeResponseSchema },
      403: { description: 'Fotos indisponíveis no momento' },
      404: { description: 'Foto não encontrada' }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<PhotoParamsRequest>): ManageRequestResponse<LikeResponse> => {
    if (!ids.guestId) return manageError({ code: 'unauthorized' })

    const context = await loadGuestContext(ids.guestId)
    if (!context) return manageError({ code: 'user_not_found' })
    if (!arePhotosVisible(context.event)) return manageError({ code: 'forbidden', details: 'Fotos indisponíveis no momento' })

    const photo = await photoRepository.findById(params.id)
    if (!photo || photo.eventId !== context.event.id) return manageError({ code: 'not_found' })

    const liked = await likeRepository.create({ eventId: photo.eventId, photoId: photo.id, guestId: ids.guestId })
    const removed = liked ? false : await likeRepository.remove(photo.id, ids.guestId)
    const delta = liked ? 1 : removed ? -1 : 0
    const likesCount = delta === 0 ? photo.likesCount : await photoRepository.addLikes(photo.id, delta)

    broadcastEvent(photo.eventId, 'photo:like', { photoId: photo.id, likesCount: likesCount ?? 0 })

    return { liked, likesCount: likesCount ?? 0 }
  }
)

export const deleteMyPhoto = defineAction(
  {
    method: 'delete',
    path: '/guest/photos/:id',
    summary: 'Excluir foto enviada pelo próprio convidado',
    tags: ['Fotos'],
    middlewares: [guestSessionMiddleware],
    schema: { params: photoParamsSchema },
    responses: {
      200: { description: 'Foto excluída', schema: photoSchema },
      403: { description: 'A foto pertence a outro convidado' },
      404: { description: 'Foto não encontrada' }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<PhotoParamsRequest>): ManageRequestResponse<PhotoResponse> => {
    if (!ids.guestId) return manageError({ code: 'unauthorized' })

    const photo = await photoRepository.findById(params.id)
    if (!photo) return manageError({ code: 'not_found' })
    if (photo.guestId !== ids.guestId) return manageError({ code: 'forbidden' })

    const [response] = await toPhotoResponses([photo], ids.guestId)

    await photoRepository.delete(photo.id)
    await Promise.all([likeRepository.deleteByPhoto(photo.id), removePhotoFile(photo.storagePath)])

    broadcastEvent(photo.eventId, 'photo:delete', { photoId: photo.id })

    return response
  }
)
