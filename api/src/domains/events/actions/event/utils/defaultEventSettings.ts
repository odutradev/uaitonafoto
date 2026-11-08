import { generatePin } from '../../../utils/eventPin'
import type { EventSettings } from '../../../repositories/events/types'

export const buildDefaultEventSettings = (): EventSettings => ({
  uploadWindowHours: 24,
  galleryDurationDays: 30,
  maxPhotosPerGuest: 10,
  photoVisibility: 'during_event',
  pinEnabled: true,
  pin: generatePin(),
  pinRotate: true,
  pinRotationMinutes: 15,
  pinUpdatedAt: new Date().toISOString()
})

export default buildDefaultEventSettings
