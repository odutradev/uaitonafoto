import axios from 'axios'

import defaultConfig from '@assets/config'
import { getClientDeviceId, getClientFingerprint } from '@hooks/usePinLockout'

export const guestTokenStoragePrefix = 'uaitonafoto:guest:'

const guestApi = axios.create({ baseURL: defaultConfig.baseURL })

guestApi.interceptors.request.use((config) => {
  config.headers['x-client-device-id'] = getClientDeviceId()
  config.headers['x-client-fingerprint'] = getClientFingerprint()
  return config
})

export const getStoredGuestToken = (eventToken: string): string | null =>
  localStorage.getItem(`${guestTokenStoragePrefix}${eventToken}`)

export const storeGuestToken = (eventToken: string, guestToken: string): void =>
  localStorage.setItem(`${guestTokenStoragePrefix}${eventToken}`, guestToken)

export const clearGuestToken = (eventToken: string): void =>
  localStorage.removeItem(`${guestTokenStoragePrefix}${eventToken}`)

export const withGuestToken = (guestToken: string) => ({ headers: { Authorization: `Bearer ${guestToken}` } })

export const buildRoomStreamUrl = (roomId: string, token?: string): string => {
  const url = new URL(`${defaultConfig.baseURL}/rooms/${encodeURIComponent(roomId)}/stream`)
  if (token) url.searchParams.set('token', token)
  return url.toString()
}

export default guestApi
