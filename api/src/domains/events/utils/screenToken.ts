import jwt from 'jsonwebtoken'

import { getJwtSecret } from '@config/env'

import type { ScreenTokenPayload } from './types'

export const signScreenToken = (eventId: string, screenId: string, galleryExpiresAt: string): string => {
  const expiresIn = Math.max(1, Math.floor((new Date(galleryExpiresAt).getTime() - Date.now()) / 1000))
  const payload: ScreenTokenPayload = { purpose: 'screen', eventId, screenId }
  return jwt.sign(payload, getJwtSecret(), { expiresIn })
}

export const verifyScreenToken = (token: string): ScreenTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as ScreenTokenPayload
    return decoded.purpose === 'screen' && decoded.eventId && decoded.screenId ? decoded : null
  } catch {
    return null
  }
}
