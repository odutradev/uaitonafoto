import api from '@services/api'

import type { AuthUser } from '@stores/auth/types'
import type { UpdateMePayload } from './types'

export const getMeData = async (): Promise<AuthUser> => {
  const response = await api.get<AuthUser>('/auth/me')
  return response.data
}

export const updateMeData = async (payload: UpdateMePayload): Promise<AuthUser> => {
  const response = await api.patch<AuthUser>('/auth/me', payload)
  return response.data
}
