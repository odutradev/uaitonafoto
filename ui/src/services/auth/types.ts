import type { SyncPayload } from '@hooks/useAuth/types'
import type { AuthUser } from '@stores/auth/types'

export interface SyncServicePayload extends SyncPayload {
  firebaseToken: string
}

export interface SyncResponse {
  token: string
  user: AuthUser
}

export interface UpdateMePayload {
  fullName?: string
  photoUrl?: string
  phone?: string
  name?: string
}

export interface ForgotPasswordPayload {
  email: string
  redirectUrl?: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
}
