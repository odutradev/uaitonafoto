export type EventType = 'birthday' | 'wedding' | 'corporate' | 'other'

export type EventMemberRole = 'creator' | 'organizer'

export type PhotoVisibility = 'during_event' | 'after_event'

export interface EventSettings {
  uploadWindowHours: number
  galleryDurationDays: number
  maxPhotosPerGuest: number
  photoVisibility: PhotoVisibility
}

export interface EventMember {
  userId: string
  role: EventMemberRole
  addedAt: string
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
  members: EventMember[]
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
  creatorId: string
}

export interface UpdateEventPayload {
  name?: string
  description?: string
  type?: EventType
  startsAt?: string
  endsAt?: string
  settings?: Partial<EventSettings>
}

export interface ListEventsByMemberParams {
  userId: string
  limit: number
  offset: number
}
