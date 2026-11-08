import type { EventSettings } from '../repositories/events/types'

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
