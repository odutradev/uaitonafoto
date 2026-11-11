import axios from 'axios'

import defaultConfig from '@assets/config'
import { getClientDeviceId, getClientFingerprint } from '@hooks/usePinLockout'

import type { ScreenEventInfo } from '@utils/types/events'

export const SCREEN_TOKEN_STORAGE_PREFIX = 'uaitonafoto:screen:'
export const SCREEN_EVENT_STORAGE_PREFIX = 'uaitonafoto:screen:event:'
export const SCREEN_PIN_STORAGE_PREFIX = 'uaitonafoto:screen:pin:'

const screenApi = axios.create({ baseURL: defaultConfig.baseURL })

screenApi.interceptors.request.use((config) => {
  config.headers['x-client-device-id'] = getClientDeviceId()
  config.headers['x-client-fingerprint'] = getClientFingerprint()
  return config
})

export const getStoredScreenToken = (eventId: string): string | null =>
  localStorage.getItem(`${SCREEN_TOKEN_STORAGE_PREFIX}${eventId}`)

export const getStoredScreenPin = (eventId: string): string | null =>
  localStorage.getItem(`${SCREEN_PIN_STORAGE_PREFIX}${eventId}`)

export const storeScreenPin = (eventId: string, pin: string | null): void => {
  if (pin) {
    localStorage.setItem(`${SCREEN_PIN_STORAGE_PREFIX}${eventId}`, pin)
  } else {
    localStorage.removeItem(`${SCREEN_PIN_STORAGE_PREFIX}${eventId}`)
  }
}

export const getStoredScreenEvent = (eventId: string): ScreenEventInfo | null => {
  const raw = localStorage.getItem(`${SCREEN_EVENT_STORAGE_PREFIX}${eventId}`)
  if (!raw) return null
  try {
    return JSON.parse(raw) as ScreenEventInfo
  } catch {
    return null
  }
}

export const storeScreenCredential = (
  eventId: string,
  screenToken: string,
  event: ScreenEventInfo,
  pin?: string | null
): void => {
  localStorage.setItem(`${SCREEN_TOKEN_STORAGE_PREFIX}${eventId}`, screenToken)
  localStorage.setItem(`${SCREEN_EVENT_STORAGE_PREFIX}${eventId}`, JSON.stringify(event))
  if (pin !== undefined) {
    storeScreenPin(eventId, pin)
  }
}

export const clearScreenCredential = (eventId: string): void => {
  localStorage.removeItem(`${SCREEN_TOKEN_STORAGE_PREFIX}${eventId}`)
  localStorage.removeItem(`${SCREEN_EVENT_STORAGE_PREFIX}${eventId}`)
  localStorage.removeItem(`${SCREEN_PIN_STORAGE_PREFIX}${eventId}`)
}

export const withScreenToken = (screenToken: string) => ({
  headers: { Authorization: `Bearer ${screenToken}` }
})

export const buildScreenStreamUrl = (eventId: string, screenToken: string): string =>
  `${defaultConfig.baseURL}/events/${encodeURIComponent(eventId)}/screen/stream?token=${encodeURIComponent(screenToken)}`

export default screenApi

