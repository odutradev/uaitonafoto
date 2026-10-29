import api from '@services/api'

import type { ForgotPasswordPayload, ResetPasswordPayload } from './types'

export const requestPasswordReset = async (payload: ForgotPasswordPayload): Promise<void> => {
  await api.post('/auth/forgot-password', {
    ...payload,
    redirectUrl: payload.redirectUrl ?? window.location.origin
  })
}

export const confirmPasswordReset = async (payload: ResetPasswordPayload): Promise<void> => {
  await api.post('/auth/reset-password', payload)
}

