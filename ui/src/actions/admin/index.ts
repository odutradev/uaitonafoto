import api from '@utils/api'

import type {
  AddCreditsPayload,
  AddCreditsResponse,
  AdminMetrics,
  AdminMetricsParams,
  ListAdminUsersParams,
  PaginatedAdminUsersResponse
} from '@utils/types/admin'

export const getAdminMetrics = async (params?: AdminMetricsParams): Promise<AdminMetrics> => {
  const response = await api.get<AdminMetrics>('/admin/metrics/details', { params })
  return response.data
}

export const listAdminUsers = async (
  params?: ListAdminUsersParams
): Promise<PaginatedAdminUsersResponse> => {
  const response = await api.get<PaginatedAdminUsersResponse>('/admin/users/list', { params })
  return response.data
}

export const addAdminUserCredits = async (
  userId: string,
  payload: AddCreditsPayload
): Promise<AddCreditsResponse> => {
  const response = await api.post<AddCreditsResponse>(`/admin/users/${userId}/credits/add`, payload)
  return response.data
}


