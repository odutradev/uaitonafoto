import type { StoredPinLockout } from './types'

export const CLIENT_DEVICE_ID_KEY = 'uaitonafoto:client_device_id'
export const PIN_LOCKOUT_STORAGE_PREFIX = 'uaitonafoto:lockout:'

export const PIN_LOCKOUT_MAX_FREE_ATTEMPTS = 4
export const PIN_LOCKOUT_PERMANENT_THRESHOLD = 10

export const PIN_LOCKOUT_DURATIONS: Record<number, number> = {
  5: 60,
  6: 300,
  7: 900,
  8: 3600,
  9: 3600
}

export const getClientDeviceId = (): string => {
  try {
    let id = localStorage.getItem(CLIENT_DEVICE_ID_KEY)
    if (!id) {
      id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `dev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      localStorage.setItem(CLIENT_DEVICE_ID_KEY, id)
    }
    return id
  } catch {
    return 'browser_device'
  }
}

export const getStorageKey = (scope: string, targetId: string): string =>
  `${PIN_LOCKOUT_STORAGE_PREFIX}${scope}:${targetId}`

export const readStoredLockout = (storageKey: string): StoredPinLockout => {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return { attempts: 0, lockedUntil: null, isPermanent: false }
    return JSON.parse(raw) as StoredPinLockout
  } catch {
    return { attempts: 0, lockedUntil: null, isPermanent: false }
  }
}

export const writeStoredLockout = (storageKey: string, data: StoredPinLockout): void => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data))
  } catch {
  }
}

export const clearStoredLockout = (storageKey: string): void => {
  try {
    localStorage.removeItem(storageKey)
  } catch {
  }
}

export const formatLockoutCountdown = (seconds: number): string => {
  if (seconds <= 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const formattedMins = mins.toString().padStart(2, '0')
  const formattedSecs = secs.toString().padStart(2, '0')
  return `${formattedMins}:${formattedSecs}`
}

export const parseLockoutError = (error: unknown) => {
  const axiosError = error as {
    response?: {
      headers?: Record<string, string | undefined>
    }
  }
  const headers = axiosError?.response?.headers ?? {}
  const retryAfter = headers['retry-after'] || headers['x-lockout-remaining-seconds']
  const permanent = headers['x-lockout-permanent']
  const attempts = headers['x-lockout-attempts']

  const retryAfterSeconds = retryAfter ? parseInt(retryAfter, 10) : undefined
  const isPermanent = permanent === 'true'
  const serverAttempts = attempts ? parseInt(attempts, 10) : undefined

  return {
    retryAfterSeconds: !isNaN(Number(retryAfterSeconds)) ? Number(retryAfterSeconds) : undefined,
    isPermanent,
    serverAttempts: !isNaN(Number(serverAttempts)) ? Number(serverAttempts) : undefined
  }
}
