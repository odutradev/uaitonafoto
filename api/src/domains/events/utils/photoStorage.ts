import { deleteDirectory, deleteFile, uploadFile } from '@firebase/services/storage'
import photoRepository from '@domains/events/repositories/photos'
import likeRepository from '@domains/events/repositories/likes'

import type { StoreEventPhotoParams } from './types'

const PHOTO_CACHE_CONTROL = 'public, max-age=31536000, immutable'

export const buildPhotoPath = (eventId: string, photoId: string, extension: string): string =>
  `events/${eventId}/photos/${photoId}.${extension}`

export const storeEventPhoto = ({ eventId, photoId, extension, buffer, contentType }: StoreEventPhotoParams) =>
  uploadFile({
    path: buildPhotoPath(eventId, photoId, extension),
    file: buffer,
    contentType,
    isPublic: true,
    cacheControl: PHOTO_CACHE_CONTROL
  })

export const removePhotoFile = (storagePath: string): Promise<boolean> => deleteFile(storagePath)

export const removeEventPhotoFiles = (eventId: string): Promise<void> =>
  deleteDirectory(`events/${eventId}/photos/`)

export const purgeEventPhotos = async (eventId: string): Promise<void> => {
  await removeEventPhotoFiles(eventId)
  await Promise.all([photoRepository.deleteByEvent(eventId), likeRepository.deleteByEvent(eventId)])
}
