export type User = {
  id: string
  role: 'admin' | 'user'
  name: string
  email: string
  fullName?: string
  department?: string
  phone?: string
  photoUrl?: string
  authProviderId?: string
  notifySweepstakeResult?: boolean
  createdAt: string
  updatedAt: string
}

export type GetUsersParams = {
  page?: number
  limit?: number
  search?: string
  role?: string
}

export type GetUsersResponse = {
  data: User[]
  meta: {
    total: number
    totalPages: number
    limit: number
    page: number
  }
}

export type UpdateUserPayload = {
  name?: string
  email?: string
  fullName?: string
  department?: string
  phone?: string
  role?: 'admin' | 'user'
  notifySweepstakeResult?: boolean
}
