import api from '@interceptor'

import type { GetLogsParams, PaginatedLogsResponse } from './types'

export const getLogs = async (params?: GetLogsParams): Promise<PaginatedLogsResponse> => {
  const response = await api.get<PaginatedLogsResponse>('/logs', { params })
  return response.data
}
