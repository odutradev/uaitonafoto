import { getClientDeviceId, getClientFingerprint, getClientIp } from './clientIdentity'

import type { Request, Response } from 'express'

export type PinLockoutScope = 'screen' | 'guest'

export interface PinLockoutParams {
  scope: PinLockoutScope
  targetId: string
  req?: Request
  res?: Response
}

export interface PinLockoutStatus {
  isLocked: boolean
  isPermanent: boolean
  remainingSeconds: number
  attempts: number
  message?: string
}

export const PIN_LOCKOUT_MAX_FREE_ATTEMPTS = 4
export const PIN_LOCKOUT_PERMANENT_THRESHOLD = 10

export const PIN_LOCKOUT_DURATIONS: Record<number, number> = {
  5: 60,
  6: 300,
  7: 900,
  8: 3600,
  9: 3600
}

interface LockoutEntry {
  attempts: number
  lockedUntil: number | null
  isPermanent: boolean
  lastAttemptAt: number
}

const lockoutStore = new Map<string, LockoutEntry>()

export const formatLockoutDuration = (seconds: number): string => {
  if (seconds <= 0) return '0 segundos'
  if (seconds < 60) return `${seconds} segundo${seconds > 1 ? 's' : ''}`
  const minutes = Math.floor(seconds / 60)
  const remainingSecs = seconds % 60
  if (minutes < 60) {
    if (remainingSecs === 0) {
      return `${minutes} minuto${minutes > 1 ? 's' : ''}`
    }
    return `${minutes} min e ${remainingSecs} s`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMins = minutes % 60
  if (remainingMins === 0) {
    return `${hours} hora${hours > 1 ? 's' : ''}`
  }
  return `${hours} h e ${remainingMins} min`
}

const getStorageKeys = (
  scope: PinLockoutScope,
  targetId: string,
  req?: Request
): { deviceKey: string | null; ipKey: string; fpKey: string | null } => {
  const ip = getClientIp(req)
  const deviceId = getClientDeviceId(req)
  const fp = getClientFingerprint(req)
  const ipKey = `${scope}:${targetId}:ip:${ip}`
  const deviceKey = deviceId ? `${scope}:${targetId}:device:${deviceId}` : null
  const fpKey = fp ? `${scope}:${targetId}:fp:${fp}` : null
  return { deviceKey, ipKey, fpKey }
}

const getLockoutEntry = (key: string): LockoutEntry | null => {
  const entry = lockoutStore.get(key)
  if (!entry) return null

  if (!entry.isPermanent && entry.lockedUntil && entry.lockedUntil <= Date.now()) {
    entry.lockedUntil = null
  }
  return entry
}

const applyResponseHeaders = (res: Response | undefined, status: PinLockoutStatus) => {
  if (!res || res.headersSent) return
  if (status.isPermanent) {
    res.setHeader('X-Lockout-Permanent', 'true')
    res.setHeader('X-Lockout-Attempts', String(status.attempts))
  } else if (status.isLocked && status.remainingSeconds > 0) {
    res.setHeader('Retry-After', String(status.remainingSeconds))
    res.setHeader('X-Lockout-Remaining-Seconds', String(status.remainingSeconds))
    res.setHeader('X-Lockout-Permanent', 'false')
    res.setHeader('X-Lockout-Attempts', String(status.attempts))
  }
}

export const checkPinLockout = ({ scope, targetId, req, res }: PinLockoutParams): PinLockoutStatus => {
  const { deviceKey, ipKey, fpKey } = getStorageKeys(scope, targetId, req)
  const deviceEntry = deviceKey ? getLockoutEntry(deviceKey) : null
  const fpEntry = fpKey ? getLockoutEntry(fpKey) : null
  const ipEntry = getLockoutEntry(ipKey)

  const activeEntry =
    (deviceEntry?.isPermanent ? deviceEntry : null) ||
    (fpEntry?.isPermanent ? fpEntry : null) ||
    (ipEntry?.isPermanent ? ipEntry : null) ||
    (deviceEntry?.lockedUntil && deviceEntry.lockedUntil > Date.now() ? deviceEntry : null) ||
    (fpEntry?.lockedUntil && fpEntry.lockedUntil > Date.now() ? fpEntry : null) ||
    (ipEntry?.lockedUntil && ipEntry.lockedUntil > Date.now() ? ipEntry : null) ||
    deviceEntry ||
    fpEntry ||
    ipEntry

  if (!activeEntry) {
    return {
      isLocked: false,
      isPermanent: false,
      remainingSeconds: 0,
      attempts: 0
    }
  }

  const now = Date.now()

  if (activeEntry.isPermanent) {
    const status: PinLockoutStatus = {
      isLocked: true,
      isPermanent: true,
      remainingSeconds: Infinity,
      attempts: activeEntry.attempts,
      message: 'Acesso bloqueado definitivamente após 10 tentativas incorretas. Entre em contato com o organizador do evento.'
    }
    applyResponseHeaders(res, status)
    return status
  }

  if (activeEntry.lockedUntil && activeEntry.lockedUntil > now) {
    const remainingSeconds = Math.max(1, Math.ceil((activeEntry.lockedUntil - now) / 1000))
    const status: PinLockoutStatus = {
      isLocked: true,
      isPermanent: false,
      remainingSeconds,
      attempts: activeEntry.attempts,
      message: `Muitas tentativas incorretas. Tente novamente em ${formatLockoutDuration(remainingSeconds)}.`
    }
    applyResponseHeaders(res, status)
    return status
  }

  return {
    isLocked: false,
    isPermanent: false,
    remainingSeconds: 0,
    attempts: activeEntry.attempts
  }
}

export const recordPinFailure = ({ scope, targetId, req, res }: PinLockoutParams): PinLockoutStatus => {
  const { deviceKey, ipKey, fpKey } = getStorageKeys(scope, targetId, req)
  const now = Date.now()

  const keysToUpdate = [ipKey]
  if (deviceKey) keysToUpdate.push(deviceKey)
  if (fpKey) keysToUpdate.push(fpKey)

  let highestAttempts = 0
  let isPermanent = false
  let lockedUntil: number | null = null
  let remainingSeconds = 0

  keysToUpdate.forEach((key) => {
    const existing = lockoutStore.get(key)
    const attempts = (existing?.attempts ?? 0) + 1
    highestAttempts = Math.max(highestAttempts, attempts)

    let itemIsPermanent = existing?.isPermanent || attempts >= PIN_LOCKOUT_PERMANENT_THRESHOLD
    let itemLockedUntil: number | null = null

    if (itemIsPermanent) {
      isPermanent = true
      remainingSeconds = Infinity
    } else if (attempts >= 5) {
      const durationSeconds = PIN_LOCKOUT_DURATIONS[attempts] ?? 3600
      remainingSeconds = Math.max(remainingSeconds, durationSeconds)
      itemLockedUntil = now + durationSeconds * 1000
      lockedUntil = Math.max(lockedUntil ?? 0, itemLockedUntil)
    }

    lockoutStore.set(key, {
      attempts,
      lockedUntil: itemLockedUntil,
      isPermanent: itemIsPermanent,
      lastAttemptAt: now
    })
  })

  let message: string
  if (isPermanent) {
    message = 'Acesso bloqueado definitivamente após 10 tentativas incorretas. Entre em contato com o organizador do evento.'
  } else if (lockedUntil && remainingSeconds > 0) {
    message = `PIN incorreto. Dispositivo bloqueado temporariamente. Tente novamente em ${formatLockoutDuration(remainingSeconds)}.`
  } else {
    const remainingFree = Math.max(0, 5 - highestAttempts)
    message =
      remainingFree > 0
        ? `PIN incorreto. Você tem mais ${remainingFree} ${remainingFree === 1 ? 'tentativa' : 'tentativas'} antes do bloqueio temporário.`
        : 'PIN incorreto. Tente novamente.'
  }

  const status: PinLockoutStatus = {
    isLocked: isPermanent || (lockedUntil !== null && lockedUntil > now),
    isPermanent,
    remainingSeconds,
    attempts: highestAttempts,
    message
  }

  applyResponseHeaders(res, status)
  return status
}

export const resetPinLockout = ({ scope, targetId, req }: PinLockoutParams): void => {
  const { deviceKey, ipKey, fpKey } = getStorageKeys(scope, targetId, req)
  if (deviceKey) lockoutStore.delete(deviceKey)
  if (fpKey) lockoutStore.delete(fpKey)
  lockoutStore.delete(ipKey)
}

export const resetPinLockoutsForTarget = (
  targetIds: string | string[],
  scope?: PinLockoutScope | 'all'
): number => {
  const ids = Array.isArray(targetIds) ? targetIds : [targetIds]
  let removedCount = 0

  for (const key of lockoutStore.keys()) {
    const matchesScope = !scope || scope === 'all' || key.startsWith(`${scope}:`)
    const matchesTarget = ids.some((id) => key.includes(`:${id}:`))

    if (matchesScope && matchesTarget) {
      lockoutStore.delete(key)
      removedCount++
    }
  }

  return removedCount
}

setInterval(() => {
  const now = Date.now()
  const expirationThreshold = 24 * 60 * 60 * 1000

  for (const [key, entry] of lockoutStore.entries()) {
    if (!entry.isPermanent && now - entry.lastAttemptAt > expirationThreshold) {
      lockoutStore.delete(key)
    }
  }
}, 15 * 60 * 1000).unref?.()

