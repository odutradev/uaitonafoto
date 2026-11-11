import jwt from 'jsonwebtoken'

import { getJwtSecret } from '@config/env'

import type { GuestTokenPayload } from './types'

export const signGuestToken = (guestId: string, galleryExpiresAt: string): string => {
  const expiresIn = Math.max(1, Math.floor((new Date(galleryExpiresAt).getTime() - Date.now()) / 1000))
  const payload: GuestTokenPayload = { purpose: 'guest', guestId }
  return jwt.sign(payload, getJwtSecret(), { expiresIn })
}

export const verifyGuestToken = (token: string): GuestTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as GuestTokenPayload
    return decoded.purpose === 'guest' && decoded.guestId ? decoded : null
  } catch {
    return null
  }
}
