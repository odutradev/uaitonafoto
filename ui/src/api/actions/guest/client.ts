import axios from 'axios'

import defaultConfig from '@config/default'
import { getClientDeviceId, getClientFingerprint } from '@hooks/usePinLockout'

export const GUEST_TOKEN_STORAGE_PREFIX = 'uaitonafoto:guest:'

const guestApi = axios.create({ baseURL: defaultConfig.baseURL })

guestApi.interceptors.request.use((config) => {
  config.headers['x-client-device-id'] = getClientDeviceId()
  config.headers['x-client-fingerprint'] = getClientFingerprint()
  return config
})

export const getStoredGuestToken = (eventToken: string): string | null =>
  localStorage.getItem(`${GUEST_TOKEN_STORAGE_PREFIX}${eventToken}`)

export const storeGuestToken = (eventToken: string, guestToken: string): void =>
  localStorage.setItem(`${GUEST_TOKEN_STORAGE_PREFIX}${eventToken}`, guestToken)

export const clearGuestToken = (eventToken: string): void =>
  localStorage.removeItem(`${GUEST_TOKEN_STORAGE_PREFIX}${eventToken}`)

export const withGuestToken = (guestToken: string) => ({ headers: { Authorization: `Bearer ${guestToken}` } })

export const buildRoomStreamUrl = (roomId: string, token?: string): string => {
  const url = new URL(`${defaultConfig.baseURL}/rooms/${encodeURIComponent(roomId)}`)
  if (token) url.searchParams.set('token', token)
  return url.toString()
}

export default guestApi
