import api from '@services/api'

import type { SyncServicePayload, SyncResponse } from './types'

export const syncAuthUser = async ({ firebaseToken, ...payload }: SyncServicePayload): Promise<SyncResponse> => {
  const response = await api.post<SyncResponse>('/auth/sync', payload, {
    headers: {
      Authorization: `Bearer ${firebaseToken}`
    }
  })
  return response.data
}
