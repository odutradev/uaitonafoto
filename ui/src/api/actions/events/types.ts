export type EventType = 'birthday' | 'wedding' | 'corporate' | 'other'
export type EventMemberRole = 'creator' | 'organizer'
export type PhotoVisibility = 'during_event' | 'after_event'
export type EventPhase = 'upcoming' | 'open' | 'closed' | 'expired'

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

export interface EventItem {
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
  members: EventMember[]
  myRole: EventMemberRole
  createdAt: string
  updatedAt: string
}

export interface CreateEventPayload {
  name: string
  description?: string
  type: EventType
  startsAt: string
  endsAt: string
  settings?: Partial<EventSettings>
}

export type UpdateEventPayload = Partial<Omit<CreateEventPayload, 'settings'>> & {
  settings?: Partial<EventSettings>
}

export interface PaginationMeta {
  totalPages: number
  limit: number
  total: number
  page: number
}

export interface Paginated<T> {
  meta: PaginationMeta
  data: T[]
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface TeamMember {
  userId: string
  name: string
  email: string
  photoUrl?: string
  role: EventMemberRole
  addedAt: string
}

export interface EventPhoto {
  id: string
  url: string
  guestId: string
  guestName: string
  likesCount: number
  likedByMe?: boolean
  mine?: boolean
  createdAt: string
}

export interface EventGuest {
  id: string
  name: string
  photosCount: number
  createdAt: string
}

export interface ScreenResponse {
  photos: EventPhoto[]
  nextSince?: string
}

export interface AlbumParams extends PaginationParams {
  guestId?: string
}

export interface ScreenParams {
  since?: string
  limit?: number
}
