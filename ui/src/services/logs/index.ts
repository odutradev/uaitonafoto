import api from '@services/api'
import type { ListLogsQuery, ListLogsResponse } from './types'

export const getLogs = async (params?: ListLogsQuery): Promise<ListLogsResponse> => {
  const response = await api.get<ListLogsResponse>('/logs', { params })
  return response.data
}

