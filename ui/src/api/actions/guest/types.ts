import type { EventPhoto, EventPhase, EventType, PhotoVisibility, EventCustomization } from '@actions/events/types'

export interface GuestEventInfo {
  name: string
  description?: string
  type: EventType
  startsAt: string
  endsAt: string
  uploadsCloseAt: string
  galleryExpiresAt: string
  photoVisibility: PhotoVisibility
  requiresPin: boolean
  phase: EventPhase
  customization?: EventCustomization
}

export interface GuestProfile {
  id: string
  name: string
}

export interface JoinEventResponse {
  guestToken: string
  guest: GuestProfile
  event: GuestEventInfo
}

export interface GuestSession {
  guest: GuestProfile
  event: GuestEventInfo
  photosSent: number
}

export interface LikeResult {
  liked: boolean
  likesCount: number
}

export type GuestPhoto = EventPhoto
