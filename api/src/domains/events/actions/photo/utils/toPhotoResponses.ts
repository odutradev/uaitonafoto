import guestRepository from '../../../repositories/guests'
import likeRepository from '../../../repositories/likes'

import type { PhotoEntity } from '../../../repositories/photos/types'
import type { PhotoResponse } from '../types'

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
    ...(viewerGuestId ? { likedByMe: likedIds?.has(photo.id) ?? false, mine: photo.guestId === viewerGuestId } : {}),
    createdAt: photo.createdAt
  }))
}

export default toPhotoResponses
