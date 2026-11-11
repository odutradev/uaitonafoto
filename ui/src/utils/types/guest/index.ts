import type {
  EventPhoto,
  EventPhase,
  EventType,
  PhotoVisibility,
  EventCustomization,
  EventChallenge
} from '@utils/types/events'

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
  challengesEnabled?: boolean
  challengesMode?: 'choose' | 'random'
  challenges?: EventChallenge[]
}

export interface GuestProfile {
  id: string
  name: string
}

export interface JoinEventResponse {
  guestToken: string
  guest: GuestProfile
  event: GuestEventInfo
  completedChallengeIds?: string[]
}

export interface GuestSession {
  guest: GuestProfile
  event: GuestEventInfo
  photosSent: number
  completedChallengeIds?: string[]
}

export interface LikeResult {
  liked: boolean
  likesCount: number
}

export type GuestPhoto = EventPhoto
