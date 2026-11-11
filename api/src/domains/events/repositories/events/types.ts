export type EventType = 'birthday' | 'wedding' | 'corporate' | 'other'

export type EventCreditType = 'free' | 'paid'

export type EventPlanTier = 'single' | 'essential' | 'pro'

export type EventMemberRole = 'creator' | 'organizer'

export type PhotoVisibility = 'during_event' | 'after_event'

export type PinRotationMinutes = 5 | 15 | 30 | 60

export type ChallengeSelectionMode = 'choose' | 'random'

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
  isBlocked: boolean
}

export interface EventScreenHistoryEntry {
  id: string
  screenId: string
  name?: string
  action: 'created' | 'updated' | 'deleted' | 'connected' | 'disconnected' | 'blocked' | 'unblocked'
  timestamp: string
}

export interface EventCustomization {
  enabled: boolean
  agencyName?: string
  agencyLogoUrl?: string
  agencyWhatsapp?: string
  agencyTagline?: string
  whatsappMessage?: string
  primaryColor?: string
}

export type EventNotificationKey = 'reminderSentAt' | 'summarySentAt' | 'galleryExpiringSentAt' | 'galleryExpiredSentAt'

export type EventNotifications = Partial<Record<EventNotificationKey, string>>

export interface EventEntity {
  id: string
  name: string
  description?: string
  type: EventType
  creditType: EventCreditType
  planTier?: EventPlanTier
  startsAt: string
  endsAt: string
  guestToken: string
  settings: EventSettings
  customization?: EventCustomization
  uploadsCloseAt: string
  galleryExpiresAt: string
  galleryCleanedAt?: string
  closedAt?: string
  notifications?: EventNotifications
  challenges?: EventChallenge[]
  members: EventMember[]
  screens: EventScreenSlot[]
  screenHistory?: EventScreenHistoryEntry[]
  createdAt: string
  updatedAt: string
}

export interface CreateEventPayload {
  name: string
  description?: string
  type: EventType
  creditType: EventCreditType
  planTier?: EventPlanTier
  startsAt: string
  endsAt: string
  settings: EventSettings
  customization?: EventCustomization
  uploadsCloseAt: string
  galleryExpiresAt: string
  creatorId: string
}

export interface UpdateEventPayload {
  name?: string
  description?: string
  type?: EventType
  creditType?: EventCreditType
  planTier?: EventPlanTier
  startsAt?: string
  endsAt?: string
  settings?: Partial<EventSettings>
  customization?: EventCustomization
  challenges?: EventChallenge[]
  uploadsCloseAt?: string
  galleryExpiresAt?: string
  closedAt?: string | null
}

export interface ListEventsByMemberParams {
  userId: string
  limit: number
  offset: number
}
