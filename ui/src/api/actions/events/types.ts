export type EventType = 'birthday' | 'wedding' | 'corporate' | 'other'
export type EventCreditType = 'free' | 'paid'
export type EventMemberRole = 'creator' | 'organizer'
export type PhotoVisibility = 'during_event' | 'after_event'
export type EventPhase = 'upcoming' | 'open' | 'closed' | 'expired'
export type PinRotationMinutes = 5 | 15 | 30 | 60
export type PhotoStatus = 'pending' | 'approved' | 'rejected'
export type ChallengeSelectionMode = 'choose' | 'random'

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
  photoVisibility: PhotoVisibility
  pinEnabled: boolean
  pin: string
  pinRotate: boolean
  pinRotationMinutes: PinRotationMinutes
  pinUpdatedAt: string
  moderationEnabled?: boolean
  challengesEnabled?: boolean
  challengesMode?: ChallengeSelectionMode
}

export interface EventChallenge {
  id: string
  title: string
  description?: string
  active: boolean
  createdAt: string
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
  isBlocked?: boolean
}

export interface EventScreenHistoryEntry {
  id: string
  screenId: string
  name?: string
  action: 'created' | 'updated' | 'deleted' | 'connected' | 'disconnected' | 'blocked' | 'unblocked'
  timestamp: string
}

export type EventPlanTier = 'single' | 'essential' | 'pro'

export interface EventItem {
  id: string
  name: string
  description?: string
  type: EventType
  creditType?: EventCreditType
  planTier?: EventPlanTier
  maxOrganizers?: number
  maxScreens?: number
  startsAt: string
  endsAt: string
  guestToken: string
  settings: EventSettings
  customization?: EventCustomization
  uploadsCloseAt: string
  galleryExpiresAt: string
  closedAt?: string
  phase?: EventPhase
  challenges?: EventChallenge[]
  members: EventMember[]
  screens: EventScreenSlot[]
  screenHistory?: EventScreenHistoryEntry[]
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
  challenges?: EventChallenge[]
}

export type UpdateEventPayload = Partial<Omit<CreateEventPayload, 'settings'>> & {
  settings?: Partial<EventSettings>
  challenges?: EventChallenge[]
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
  status?: PhotoStatus
  challengeId?: string
  challengeTitle?: string
  focalY?: number
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
  status?: 'all' | 'pending' | 'approved' | 'rejected'
}

export interface ScreenParams {
  since?: string
  limit?: number
}

export interface ResetLockoutsResponse {
  success: boolean
  clearedCount: number
  message: string
}

export interface ApproveAllPhotosResponse {
  approvedCount: number
}

export interface EventGuest {
  id: string
  name: string
  photosCount: number
  isBlocked: boolean
  ip?: string
  lastActiveAt?: string
  createdAt: string
}
