import type { Request } from 'express'

export interface ClientIdentity {
  ip: string
  deviceId: string
  fingerprint: string
  userAgent: string
}

export const getClientIp = (req?: Request): string => {
  if (!req) return 'unknown'
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim()
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim()
  }
  return req.ip || req.socket?.remoteAddress || 'unknown'
}

export const getClientDeviceId = (req?: Request): string => {
  if (!req) return ''
  const deviceId = req.headers['x-client-device-id']
  if (typeof deviceId === 'string' && deviceId.trim()) {
    return deviceId.trim()
  }
  return ''
}

export const getClientFingerprint = (req?: Request): string => {
  if (!req) return ''
  const fp = req.headers['x-client-fingerprint']
  if (typeof fp === 'string' && fp.trim()) {
    return fp.trim()
  }
  return ''
}

export const getClientUserAgent = (req?: Request): string => {
  if (!req) return ''
  const ua = req.headers['user-agent']
  return typeof ua === 'string' ? ua.trim() : ''
}

export const getClientIdentity = (req?: Request): ClientIdentity => ({
  ip: getClientIp(req),
  deviceId: getClientDeviceId(req),
  fingerprint: getClientFingerprint(req),
  userAgent: getClientUserAgent(req)
})

export default getClientIdentity
