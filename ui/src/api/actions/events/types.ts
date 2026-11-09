export type EventType = 'birthday' | 'wedding' | 'corporate' | 'other'
export type EventCreditType = 'free' | 'paid'
export type EventMemberRole = 'creator' | 'organizer'
export type PhotoVisibility = 'during_event' | 'after_event'
export type EventPhase = 'upcoming' | 'open' | 'closed' | 'expired'
export type PinRotationMinutes = 5 | 15 | 30 | 60

export interface EventCustomization {
  enabled: boolean
  agencyName?: string
  agencyLogoUrl?: string
  agencyWhatsapp?: string
  agencyTagline?: string
  whatsappMessage?: string
}

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

export interface EventItem {
  id: string
  name: string
  description?: string
  type: EventType
  creditType?: EventCreditType
  startsAt: string
  endsAt: string
  guestToken: string
  settings: EventSettings
  customization?: EventCustomization
  uploadsCloseAt: string
  galleryExpiresAt: string
  members: EventMember[]
  screens: EventScreenSlot[]
  myRole: EventMemberRole
  createdAt: string
  updatedAt: string
}

export interface CreateEventPayload {
  name: string
  description?: string
  type: EventType
  creditType?: EventCreditType
  startsAt: string
  endsAt?: string
  settings?: Partial<EventSettings>
  customization?: EventCustomization
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

export interface ScreenEventInfo {
  id: string
  name: string
  guestToken: string
  customization?: EventCustomization
}

export interface ActivateScreenResponse {
  screenToken: string
  event: ScreenEventInfo
  pin: string | null
}

export interface ScreenResponse {
  event: ScreenEventInfo
  photos: EventPhoto[]
  nextSince?: string
  pin: string | null
}

export interface AlbumParams extends PaginationParams {
  guestId?: string
}

export interface ScreenParams {
  since?: string
  limit?: number
}
