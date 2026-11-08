import type { EventEntity, EventSettings } from '../repositories/events/types'
import type { GuestEntity } from '../repositories/guests/types'

export type EventPhase = 'upcoming' | 'open' | 'closed' | 'expired'

export interface EventWindows {
  uploadsCloseAt: string
  galleryExpiresAt: string
}

export interface EventWindowsInput extends EventWindows {
  startsAt: string
  endsAt: string
  settings: EventSettings
}

export interface GuestTokenPayload {
  purpose: 'guest'
  guestId: string
}

export interface StoreEventPhotoParams {
  eventId: string
  photoId: string
  extension: string
  buffer: Buffer
  contentType: string
}

export interface DetectedImageType {
  contentType: string
  extension: string
}

export interface GuestContext {
  guest: GuestEntity
  event: EventEntity
}
