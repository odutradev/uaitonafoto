export interface AuthUser {
  authProviderId: string
  department?: string
  fullName?: string
  photoUrl?: string
  phone?: string
  email: string
  name: string
  role: string
  notifySweepstakeResult?: boolean
  id: string
}

export interface AuthStoreData {
  user: AuthUser | null
  token: string | null
  loading: boolean
}

export interface AuthStore {
  updateUser: (partialUser: Partial<AuthUser>) => void
  setToken: (token: string | null) => void
  setAuthUser: (user: AuthUser) => void
  setLoading: (loading: boolean) => void
  clearAuth: () => void
  auth: AuthStoreData
}