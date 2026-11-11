import { ipKeyGenerator } from 'express-rate-limit'

import { getClientDeviceId, getClientFingerprint } from '@domains/events/utils/clientIdentity'
import { createRateLimiter } from '@middlewares/rateLimit'

import type { DocumentedMiddleware } from '@factories/defineAction/types'
import type { GuestRateLimitParams } from './types'
import type { Request, Response } from 'express'

const WindowMs = 15 * 60 * 1000

const resolveIpKey = (req: Request): string => ipKeyGenerator(req.ip ?? 'unknown')

const resolveGuestKey = (req: Request, res: Response): string => {
  const guestId = typeof res.locals.guestId === 'string' ? res.locals.guestId : ''
  return guestId ? `guest:${guestId}` : `ip:${resolveIpKey(req)}`
}

const resolveEventKey = (req: Request, res: Response): string => {
  const eventId = typeof res.locals.guestEventId === 'string' ? res.locals.guestEventId : ''
  return eventId ? `event:${eventId}` : `ip:${resolveIpKey(req)}`
}

const resolveJoinDeviceKey = (req: Request): string => {
  const eventToken = typeof req.params.token === 'string' ? req.params.token : ''
  const device = getClientDeviceId(req) || getClientFingerprint(req)
  return `join:${eventToken}:${resolveIpKey(req)}:${device}`
}

const resolveJoinEventKey = (req: Request): string => {
  const eventToken = typeof req.params.token === 'string' ? req.params.token : ''
  return `join:${eventToken}`
}

export const createGuestRateLimiter = ({ name, limit, message }: GuestRateLimitParams): DocumentedMiddleware =>
  createRateLimiter({
    windowMs: WindowMs,
    limit,
    message,
    keyGenerator: (req, res) => `${name}:${resolveGuestKey(req, res)}`
  })

export const createEventRateLimiter = ({ name, limit, message }: GuestRateLimitParams): DocumentedMiddleware =>
  createRateLimiter({
    windowMs: WindowMs,
    limit,
    message,
    keyGenerator: (req, res) => `${name}:${resolveEventKey(req, res)}`
  })

export const joinDeviceRateLimiter = createRateLimiter({
  windowMs: WindowMs,
  limit: 30,
  message: 'Muitas tentativas de entrada deste aparelho. Aguarde alguns minutos e tente novamente.',
  keyGenerator: resolveJoinDeviceKey
})

export const joinEventRateLimiter = createRateLimiter({
  windowMs: WindowMs,
  limit: 3000,
  message: 'Muitas entradas simultâneas neste evento. Aguarde alguns instantes e tente novamente.',
  keyGenerator: resolveJoinEventKey
})

export const guestUploadRateLimiter = createGuestRateLimiter({
  name: 'upload',
  limit: 60,
  message: 'Você enviou muitas fotos em pouco tempo. Aguarde alguns minutos.'
})

export const eventUploadRateLimiter = createEventRateLimiter({
  name: 'upload',
  limit: 6000,
  message: 'O evento está recebendo muitas fotos agora. Tente novamente em instantes.'
})

export const guestLikeRateLimiter = createGuestRateLimiter({
  name: 'like',
  limit: 300,
  message: 'Muitas curtidas em pouco tempo. Aguarde alguns instantes.'
})

export const guestFeedRateLimiter = createGuestRateLimiter({
  name: 'feed',
  limit: 300,
  message: 'Muitas atualizações do feed em pouco tempo. Aguarde alguns instantes.'
})
