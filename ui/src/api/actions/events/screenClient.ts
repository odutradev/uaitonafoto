import axios from 'axios'

import defaultConfig from '@config/default'

import type { ScreenEventInfo } from './types'

export const SCREEN_TOKEN_STORAGE_PREFIX = 'uaitonafoto:screen:'
export const SCREEN_EVENT_STORAGE_PREFIX = 'uaitonafoto:screen:event:'

const screenApi = axios.create({ baseURL: defaultConfig.baseURL })

export const getStoredScreenToken = (eventId: string): string | null =>
  localStorage.getItem(`${SCREEN_TOKEN_STORAGE_PREFIX}${eventId}`)

export const getStoredScreenEvent = (eventId: string): ScreenEventInfo | null => {
  const raw = localStorage.getItem(`${SCREEN_EVENT_STORAGE_PREFIX}${eventId}`)
  if (!raw) return null
  try {
    return JSON.parse(raw) as ScreenEventInfo
  } catch {
    return null
  }
}

export const storeScreenCredential = (eventId: string, screenToken: string, event: ScreenEventInfo): void => {
  localStorage.setItem(`${SCREEN_TOKEN_STORAGE_PREFIX}${eventId}`, screenToken)
  localStorage.setItem(`${SCREEN_EVENT_STORAGE_PREFIX}${eventId}`, JSON.stringify(event))
}

export const clearScreenCredential = (eventId: string): void => {
  localStorage.removeItem(`${SCREEN_TOKEN_STORAGE_PREFIX}${eventId}`)
  localStorage.removeItem(`${SCREEN_EVENT_STORAGE_PREFIX}${eventId}`)
}

export const withScreenToken = (screenToken: string) => ({
  headers: { Authorization: `Bearer ${screenToken}` }
})

export default screenApi

