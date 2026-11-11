import { verifyGuestToken } from '@domains/events/utils/guestToken'
import guestRepository from '@domains/events/repositories/guests'
import { errorResponseSchema } from '@factories/errors/schemas'
import sendError from '@factories/errors'

import type { DocumentedMiddleware, ResponseConfig } from '@factories/defineAction/types'
import type { NextFunction, Request, Response } from 'express'

export const guestSessionMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization
  const queryToken = typeof req.query.token === 'string' ? req.query.token : undefined
  const rawToken = authHeader?.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : queryToken

  if (!rawToken) {
    sendError({ code: 'no_token', res, local: 'guestSessionMiddleware' })
    return
  }

  const payload = verifyGuestToken(rawToken)
  const guest = payload ? await guestRepository.findById(payload.guestId) : null

  if (!guest || guest.isBlocked) {
    sendError({ code: 'forbidden', res, local: 'guestSessionMiddleware' })
    return
  }

  res.locals.guestId = guest.id
  next()
}

export const guestSessionResponses: Record<string, ResponseConfig> = {
  401: {
    description: 'Token de convidado não fornecido ou inválido',
    schema: errorResponseSchema
  }
}

export const guestSessionWithDocs: DocumentedMiddleware = Object.assign(guestSessionMiddleware, {
  authenticate: true,
  responses: guestSessionResponses
})

export default guestSessionWithDocs
