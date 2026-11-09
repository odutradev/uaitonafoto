import { generatePin } from '../../../utils/eventPin'
import type { EventCreditType, EventSettings } from '../../../repositories/events/types'

export const buildDefaultEventSettings = (creditType: EventCreditType = 'paid'): EventSettings => ({
  uploadWindowHours: 0,
  galleryDurationDays: creditType === 'free' ? 14 : 90,
  photoVisibility: 'during_event',
  pinEnabled: true,
  pin: generatePin(),
  pinRotate: true,
  pinRotationMinutes: 15,
  pinUpdatedAt: new Date().toISOString()
})

export default buildDefaultEventSettings
