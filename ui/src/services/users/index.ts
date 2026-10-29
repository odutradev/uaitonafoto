import api from '@services/api'

import type { GetUsersResponse, UpdateUserPayload, GetUsersParams, User } from './types'

export const getUsers = async (params?: GetUsersParams): Promise<GetUsersResponse> => {
  const response = await api.get<GetUsersResponse>('/users', { params })
  return response.data
}

export const updateUser = async (id: string, payload: UpdateUserPayload): Promise<User> => {
  const response = await api.patch<User>(`/users/${id}`, payload)
  return response.data
}

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`)
}

