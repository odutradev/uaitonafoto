export type EventType = 'birthday' | 'wedding' | 'corporate' | 'other'

export type EventMemberRole = 'creator' | 'organizer'

export type PhotoVisibility = 'during_event' | 'after_event'

export type PinRotationMinutes = 5 | 15 | 30 | 60

export interface EventSettings {
  uploadWindowHours: number
  galleryDurationDays: number
  maxPhotosPerGuest: number
  photoVisibility: PhotoVisibility
  pinEnabled: boolean
  pin: string
  pinRotate: boolean
  pinRotationMinutes: PinRotationMinutes
  pinUpdatedAt: string
}

export interface EventMember {
  userId: string
  role: EventMemberRole
  addedAt: string
}

export interface EventScreenSlot {
  id: string
  name?: string
  pin: string
  createdAt: string
  activatedAt?: string
  lastSeenAt?: string
}

export interface EventEntity {
  id: string
  name: string
  description?: string
  type: EventType
  startsAt: string
  endsAt: string
  guestToken: string
  settings: EventSettings
  uploadsCloseAt: string
  galleryExpiresAt: string
  galleryCleanedAt?: string
  members: EventMember[]
  screens: EventScreenSlot[]
  createdAt: string
  updatedAt: string
}

export interface CreateEventPayload {
  name: string
  description?: string
  type: EventType
  startsAt: string
  endsAt: string
  settings: EventSettings
  uploadsCloseAt: string
  galleryExpiresAt: string
  creatorId: string
}

export interface UpdateEventPayload {
  name?: string
  description?: string
  type?: EventType
  startsAt?: string
  endsAt?: string
  settings?: Partial<EventSettings>
  uploadsCloseAt?: string
  galleryExpiresAt?: string
}

export interface ListEventsByMemberParams {
  userId: string
  limit: number
  offset: number
}
