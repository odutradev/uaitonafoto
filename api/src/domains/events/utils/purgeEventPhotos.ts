import likeRepository from '../repositories/likes'
import photoRepository from '../repositories/photos'
import { removeEventPhotoFiles } from './photoStorage'

export const purgeEventPhotos = async (eventId: string): Promise<void> => {
  await removeEventPhotoFiles(eventId)
  await Promise.all([photoRepository.deleteByEvent(eventId), likeRepository.deleteByEvent(eventId)])
}
