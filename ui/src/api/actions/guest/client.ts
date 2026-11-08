import axios from 'axios'

import defaultConfig from '@config/default'

export const GUEST_TOKEN_STORAGE_PREFIX = 'uaitonafoto:guest:'

const guestApi = axios.create({ baseURL: defaultConfig.baseURL })

export const getStoredGuestToken = (eventToken: string): string | null =>
  localStorage.getItem(`${GUEST_TOKEN_STORAGE_PREFIX}${eventToken}`)

export const storeGuestToken = (eventToken: string, guestToken: string): void =>
  localStorage.setItem(`${GUEST_TOKEN_STORAGE_PREFIX}${eventToken}`, guestToken)

export const clearGuestToken = (eventToken: string): void =>
  localStorage.removeItem(`${GUEST_TOKEN_STORAGE_PREFIX}${eventToken}`)

export const withGuestToken = (guestToken: string) => ({ headers: { Authorization: `Bearer ${guestToken}` } })

export default guestApi
