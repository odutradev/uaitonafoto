import type { EventSettings } from '../../../repositories/types'

export const defaultEventSettings: EventSettings = {
  uploadWindowHours: 24,
  galleryDurationDays: 30,
  maxPhotosPerGuest: 10,
  photoVisibility: 'during_event'
}

export default defaultEventSettings
