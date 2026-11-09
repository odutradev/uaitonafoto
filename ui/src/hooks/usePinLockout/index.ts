import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  clearStoredLockout,
  formatLockoutCountdown,
  getStorageKey,
  PIN_LOCKOUT_DURATIONS,
  PIN_LOCKOUT_PERMANENT_THRESHOLD,
  parseLockoutError,
  readStoredLockout,
  writeStoredLockout
} from './utils'

import type { PinLockoutOptions, PinLockoutState, StoredPinLockout } from './types'

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

  // Sincroniza se a chave mudar
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

  // Contagem regressiva em tempo real a cada segundo
  useEffect(() => {
    if (isPermanent || !lockedUntil || remainingSeconds <= 0) return

    const interval = window.setInterval(() => {
      const diff = Math.ceil((lockedUntil - Date.now()) / 1000)
      if (diff <= 0) {
        setRemainingSeconds(0)
        setLockedUntil(null)
        // Mantém as tentativas acumuladas, mas remove a trava de tempo
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
