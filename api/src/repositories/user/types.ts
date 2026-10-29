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
  createdAt: string
  updatedAt: string
}

export interface UpsertUserPayload {
  name: string
  email: string
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

