import type { AuthUser } from '@stores/auth/types'

export interface SyncPayload {
  authProviderId?: string
  photoUrl?: string
  email: string
  name: string
  id: string
}

export interface LoginCredentials {
  password: string
  email: string
}

export interface RegisterCredentials extends LoginCredentials {
  name: string
}

export interface UseAuthReturn {
  registerWithEmail: (credentials: RegisterCredentials) => Promise<void>
  loginWithEmail: (credentials: LoginCredentials) => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithApple: () => Promise<void>
  logout: () => Promise<void>
  user: AuthUser | null
  loading: boolean
}