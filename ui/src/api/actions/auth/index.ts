import api from '@interceptor'

import type { AuthUser } from '@stores/auth/types'
import type {
  SyncServicePayload,
  SyncResponse,
  UpdateMePayload,
  ForgotPasswordPayload,
  ResetPasswordPayload
} from './types'

export { firebaseAuth, isFirebaseConfigured } from './firebase'

export const syncAuthUser = async ({ firebaseToken, ...payload }: SyncServicePayload): Promise<SyncResponse> => {
  const response = await api.post<SyncResponse>('/auth/sync', payload, {
    headers: {
      Authorization: `Bearer ${firebaseToken}`
    }
  })
  return response.data
}

export const getMeData = async (): Promise<AuthUser> => {
  const response = await api.get<AuthUser>('/auth/me')
  return response.data
}

export const updateMeData = async (payload: UpdateMePayload): Promise<AuthUser> => {
  const response = await api.patch<AuthUser>('/auth/me', payload)
  return response.data
}

export const requestPasswordReset = async (payload: ForgotPasswordPayload): Promise<void> => {
  await api.post('/auth/forgot-password', {
    ...payload,
    redirectUrl: payload.redirectUrl ?? window.location.origin
  })
}

export const confirmPasswordReset = async (payload: ResetPasswordPayload): Promise<void> => {
  await api.post('/auth/reset-password', payload)
}
