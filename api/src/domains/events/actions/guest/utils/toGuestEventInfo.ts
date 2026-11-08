import { getEventPhase } from '../../../utils/eventWindows'

import type { EventEntity } from '../../../repositories/events/types'
import type { GuestEventInfo } from '../types'

export const toGuestEventInfo = (event: EventEntity): GuestEventInfo => ({
  name: event.name,
  description: event.description,
  type: event.type,
  startsAt: event.startsAt,
  endsAt: event.endsAt,
  uploadsCloseAt: event.uploadsCloseAt,
  galleryExpiresAt: event.galleryExpiresAt,
  maxPhotosPerGuest: event.settings.maxPhotosPerGuest,
  photoVisibility: event.settings.photoVisibility,
  requiresPin: event.settings.pinEnabled,
  phase: getEventPhase(event)
})

export default toGuestEventInfo
