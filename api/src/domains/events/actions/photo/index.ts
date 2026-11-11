import { Types } from 'mongoose'

import { likeResponseSchema, listFeedQuerySchema, listFeedResponseSchema, photoParamsSchema, photoSchema } from './schemas'
import { arePhotosVisible, canUploadPhotos, getEventPhase } from '@domains/events/utils/eventWindows'
import { buildPaginatedResponse, getPaginationOptions } from '@factories/pagination/utils'
import { removePhotoFile, storeEventPhoto } from '@domains/events/utils/photoStorage'
import guestSessionMiddleware from '@domains/events/middlewares/guestSession'
import { getClientIdentity } from '@domains/events/utils/clientIdentity'
import photoRepository from '@domains/events/repositories/photos'
import guestRepository from '@domains/events/repositories/guests'
import likeRepository from '@domains/events/repositories/likes'
import defineAction from '@factories/defineAction'
import { broadcastEvent } from '@realtime'
import upload from '@middlewares/upload'

import type { LikeResponse, ListFeedRequest, ListFeedResponse, PhotoParamsRequest, PhotoResponse } from './types'
import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type { PhotoEntity } from '@domains/events/repositories/photos/types'
import type { DetectedImageType } from '@domains/events/utils/types'

const JpegSignature = [0xff, 0xd8, 0xff]
const PngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

const startsWithSignature = (buffer: Buffer, signature: number[], offset = 0): boolean =>
  signature.every((byte, index) => buffer[offset + index] === byte)

const detectImageType = (buffer: Buffer): DetectedImageType | null => {
  if (startsWithSignature(buffer, JpegSignature)) return { contentType: 'image/jpeg', extension: 'jpg' }
  if (startsWithSignature(buffer, PngSignature)) return { contentType: 'image/png', extension: 'png' }

  const isWebp = buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  if (isWebp) return { contentType: 'image/webp', extension: 'webp' }

  return null
}

export const toPhotoResponses = async (photos: PhotoEntity[], viewerGuestId?: string): Promise<PhotoResponse[]> => {
  if (photos.length === 0) return []

  const guestIds = [...new Set(photos.map((photo) => photo.guestId))]
  const [guests, likedIds] = await Promise.all([
    guestRepository.findByIds(guestIds),
    viewerGuestId
      ? likeRepository.findLikedPhotoIds(viewerGuestId, photos.map((photo) => photo.id))
      : Promise.resolve(undefined)
  ])
  const guestNames = new Map(guests.map((guest) => [guest.id, guest.name]))

  return photos.map((photo) => ({
    id: photo.id,
    url: photo.url,
    guestId: photo.guestId,
    guestName: guestNames.get(photo.guestId) ?? 'Convidado',
    likesCount: photo.likesCount,
    status: photo.status ?? 'approved',
    challengeId: photo.challengeId,
    challengeTitle: photo.challengeTitle,
    focalY: photo.focalY,
    ...(viewerGuestId ? { likedByMe: likedIds?.has(photo.id) ?? false, mine: photo.guestId === viewerGuestId } : {}),
    createdAt: photo.createdAt
  }))
}

export const uploadPhoto = defineAction(
  {
    method: 'post',
    path: '/guest/photos/upload',
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

    const context = await guestRepository.findContext(ids.guestId)
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
        const MaxCaptureAgeMs = 10 * 60 * 1000
        const MaxFutureToleranceMs = 2 * 60 * 1000

        if (ageMs > MaxCaptureAgeMs || ageMs < -MaxFutureToleranceMs) {
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
    const rawFocalY = (data as Record<string, unknown> | undefined)?.focalY ?? defaultExpress?.req?.body?.focalY

    const challengeId = typeof rawChallengeId === 'string' && rawChallengeId.trim() ? rawChallengeId.trim() : undefined
    const challengeTitle = typeof rawChallengeTitle === 'string' && rawChallengeTitle.trim() ? rawChallengeTitle.trim() : undefined
    const focalY = rawFocalY !== undefined && rawFocalY !== null && rawFocalY !== '' && !Number.isNaN(Number(rawFocalY))
      ? Math.min(100, Math.max(0, Math.round(Number(rawFocalY))))
      : undefined

    const client = getClientIdentity(defaultExpress?.req)

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
        challengeTitle,
        focalY,
        ip: client.ip,
        deviceId: client.deviceId
      })

      void guestRepository.updateSession(guest.id, {
        ip: client.ip,
        deviceId: client.deviceId,
        deviceFingerprint: client.fingerprint,
        userAgent: client.userAgent,
        lastActiveAt: new Date().toISOString()
      }).catch(() => {})

      const [response] = await toPhotoResponses([photo], guest.id)
      broadcastEvent(event.id, isModerationOn ? 'photo:pending' : 'photo:new', response)
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
    path: '/guest/feed/list',
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

    const context = await guestRepository.findContext(ids.guestId)
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

    const context = await guestRepository.findContext(ids.guestId)
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
    path: '/guest/photos/:id/remove',
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
