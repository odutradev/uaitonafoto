import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PinLockoutOptions, PinLockoutState, StoredPinLockout } from './types'

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

const getStorageKey = (scope: string, targetId: string): string =>
  `${PIN_LOCKOUT_STORAGE_PREFIX}${scope}:${targetId}`

const readStoredLockout = (storageKey: string): StoredPinLockout => {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return { attempts: 0, lockedUntil: null, isPermanent: false }
    return JSON.parse(raw) as StoredPinLockout
  } catch {
    return { attempts: 0, lockedUntil: null, isPermanent: false }
  }
}

const writeStoredLockout = (storageKey: string, data: StoredPinLockout): void => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data))
  } catch {
  }
}

const clearStoredLockout = (storageKey: string): void => {
  try {
    localStorage.removeItem(storageKey)
  } catch {
  }
}

const formatLockoutCountdown = (seconds: number): string => {
  if (seconds <= 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const formattedMins = mins.toString().padStart(2, '0')
  const formattedSecs = secs.toString().padStart(2, '0')
  return `${formattedMins}:${formattedSecs}`
}

const parseLockoutError = (error: unknown) => {
  const axiosError = error as {
    response?: {
      status?: number
      data?: {
        message?: string
        details?: {
          locked?: boolean
          isPermanent?: boolean
          retryAfterSeconds?: number
          attempts?: number
        }
      }
    }
  }

  const details = axiosError?.response?.data?.details
  const status = axiosError?.response?.status

  if (status === 429 || status === 403 || details?.locked) {
    return {
      isLocked: true,
      isPermanent: Boolean(details?.isPermanent),
      retryAfterSeconds: details?.retryAfterSeconds,
      serverAttempts: details?.attempts
    }
  }

  return { isLocked: false }
}

const usePinLockout = ({ scope, targetId }: PinLockoutOptions): PinLockoutState => {
  const storageKey = useMemo(() => getStorageKey(scope, targetId), [scope, targetId])

  const initialStored = useMemo<StoredPinLockout>(() => {
    if (!targetId) return { attempts: 0, lockedUntil: null, isPermanent: false }
    return readStoredLockout(storageKey)
  }, [storageKey, targetId])

  const [attempts, setAttempts] = useState<number>(initialStored.attempts)
  const [isPermanent, setIsPermanent] = useState<boolean>(initialStored.isPermanent)
  const [lockedUntil, setLockedUntil] = useState<number | null>(initialStored.lockedUntil)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    if (initialStored.isPermanent) return Infinity
    if (initialStored.lockedUntil && initialStored.lockedUntil > Date.now()) {
      return Math.max(0, Math.ceil((initialStored.lockedUntil - Date.now()) / 1000))
    }
    return 0
  })

  useEffect(() => {
    if (!targetId) return
    const stored = readStoredLockout(storageKey)
    setAttempts(stored.attempts)
    setIsPermanent(stored.isPermanent)
    setLockedUntil(stored.lockedUntil)

    if (stored.isPermanent) {
      setRemainingSeconds(Infinity)
    } else if (stored.lockedUntil && stored.lockedUntil > Date.now()) {
      setRemainingSeconds(Math.max(0, Math.ceil((stored.lockedUntil - Date.now()) / 1000)))
    } else {
      setRemainingSeconds(0)
    }
  }, [storageKey, targetId])

  useEffect(() => {
    if (isPermanent || !lockedUntil || remainingSeconds <= 0) return

    const interval = window.setInterval(() => {
      const diff = Math.ceil((lockedUntil - Date.now()) / 1000)
      if (diff <= 0) {
        setRemainingSeconds(0)
        setLockedUntil(null)
        writeStoredLockout(storageKey, {
          attempts,
          lockedUntil: null,
          isPermanent: false
        })
      } else {
        setRemainingSeconds(diff)
      }
    }, 1000)

    return () => window.clearInterval(interval)
  }, [isPermanent, lockedUntil, remainingSeconds, storageKey, attempts])

  const isLocked = isPermanent || remainingSeconds > 0

  const recordFailure = useCallback(
    (error?: unknown) => {
      if (!targetId) return

      const currentStored = readStoredLockout(storageKey)
      const parsed = parseLockoutError(error)

      const nextAttempts = parsed.serverAttempts ?? currentStored.attempts + 1
      const becomesPermanent =
        currentStored.isPermanent || parsed.isPermanent || nextAttempts >= PIN_LOCKOUT_PERMANENT_THRESHOLD

      let nextLockedUntil: number | null = null
      let nextRemaining = 0

      if (becomesPermanent) {
        nextRemaining = Infinity
      } else if (parsed.retryAfterSeconds !== undefined && parsed.retryAfterSeconds > 0) {
        nextRemaining = parsed.retryAfterSeconds
        nextLockedUntil = Date.now() + parsed.retryAfterSeconds * 1000
      } else if (nextAttempts >= 5) {
        const duration = PIN_LOCKOUT_DURATIONS[nextAttempts] ?? 3600
        nextRemaining = duration
        nextLockedUntil = Date.now() + duration * 1000
      }

      const updatedRecord: StoredPinLockout = {
        attempts: nextAttempts,
        lockedUntil: nextLockedUntil,
        isPermanent: becomesPermanent
      }

      writeStoredLockout(storageKey, updatedRecord)
      setAttempts(nextAttempts)
      setIsPermanent(becomesPermanent)
      setLockedUntil(nextLockedUntil)
      setRemainingSeconds(nextRemaining)
    },
    [storageKey, targetId]
  )

  const resetLockout = useCallback(() => {
    if (!targetId) return
    clearStoredLockout(storageKey)
    setAttempts(0)
    setIsPermanent(false)
    setLockedUntil(null)
    setRemainingSeconds(0)
  }, [storageKey, targetId])

  const formattedTime = useMemo(() => formatLockoutCountdown(remainingSeconds), [remainingSeconds])

  return {
    isLocked,
    isPermanent,
    remainingSeconds,
    formattedTime,
    attempts,
    recordFailure,
    resetLockout
  }
}

export default usePinLockout
