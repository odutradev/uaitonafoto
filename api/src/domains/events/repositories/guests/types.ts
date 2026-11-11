export interface GuestEntity {
  id: string
  eventId: string
  name: string
  createdAt: string
  isBlocked?: boolean
  ip?: string
  deviceId?: string
  deviceFingerprint?: string
  userAgent?: string
  lastActiveAt?: string
  lastUploadAt?: string
}

export interface CreateGuestPayload {
  eventId: string
  name: string
  ip?: string
  deviceId?: string
  deviceFingerprint?: string
  userAgent?: string
  lastActiveAt?: string
}

export interface UpdateGuestSessionPayload {
  name?: string
  ip?: string
  deviceId?: string
  deviceFingerprint?: string
  userAgent?: string
  lastActiveAt?: string
}

export interface FindGuestForClientParams {
  eventId: string
  deviceId?: string
  fingerprint?: string
  ip?: string
  name?: string
}

export interface UploadSlotClaim {
  isClaimed: boolean
  claimedAt: string
  previousUploadAt?: string
}
