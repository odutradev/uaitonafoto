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
  photoVisibility: event.settings.photoVisibility,
  requiresPin: event.settings.pinEnabled,
  customization: event.customization,
  challengesEnabled: Boolean(event.settings.challengesEnabled),
  challenges: event.settings.challengesEnabled
    ? (event.challenges?.filter((c) => c.active) ?? [])
    : [],
  phase: getEventPhase(event)
})

export default toGuestEventInfo
