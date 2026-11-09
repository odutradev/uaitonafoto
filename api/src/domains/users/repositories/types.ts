export type UserRole = 'admin' | 'user'

export interface UserCustomization {
  enabled: boolean
  agencyName?: string
  agencyLogoUrl?: string
  agencyWhatsapp?: string
  agencyTagline?: string
  whatsappMessage?: string
  primaryColor?: string
}

export interface UserEntity {
  id: string
  role: UserRole
  name: string
  email: string
  fullName?: string
  phone?: string
  photoUrl?: string
  authProviderId?: string
  freeCredits: number
  paidCredits: number
  freeTrialClaimedAt?: string
  customization?: UserCustomization
  hasActiveSubscription?: boolean
  createdAt: string
  updatedAt: string
}

export type CreditType = 'free' | 'paid'

export interface UpsertUserPayload {
  name: string
  email: string
  fullName?: string
  photoUrl?: string
  authProviderId?: string
}

export interface UpdateUserPayload {
  name?: string
  fullName?: string
  phone?: string
  photoUrl?: string
  role?: UserRole
  customization?: UserCustomization
}
