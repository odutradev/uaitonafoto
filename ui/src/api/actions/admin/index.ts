import api from '@interceptor'

import type {
  AddCreditsPayload,
  AddCreditsResponse,
  AdminMetrics,
  AdminMetricsParams,
  ListAdminUsersParams,
  PaginatedAdminUsersResponse
} from './types'

export const getAdminMetrics = async (params?: AdminMetricsParams): Promise<AdminMetrics> => {
  const response = await api.get<AdminMetrics>('/admin/metrics', { params })
  return response.data
}

export const listAdminUsers = async (
  params?: ListAdminUsersParams
): Promise<PaginatedAdminUsersResponse> => {
  const response = await api.get<PaginatedAdminUsersResponse>('/admin/users', { params })
  return response.data
}

export const addAdminUserCredits = async (
  userId: string,
  payload: AddCreditsPayload
): Promise<AddCreditsResponse> => {
  const response = await api.post<AddCreditsResponse>(`/admin/users/${userId}/credits`, payload)
  return response.data
}

export * from './types'

