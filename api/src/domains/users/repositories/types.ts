export type UserRole = 'admin' | 'user'

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
}
