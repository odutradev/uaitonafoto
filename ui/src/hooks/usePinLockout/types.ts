export type PinLockoutScope = 'screen' | 'guest'

export interface PinLockoutOptions {
  scope: PinLockoutScope
  targetId: string
}

export interface PinLockoutState {
  isLocked: boolean
  isPermanent: boolean
  remainingSeconds: number
  formattedTime: string
  attempts: number
  recordFailure: (error?: unknown) => void
  resetLockout: () => void
}

export interface StoredPinLockout {
  attempts: number
  lockedUntil: number | null
  isPermanent: boolean
}
