import sendError from '@error/index'
import { errorResponseSchema } from '@factories/errors/schemas'
import eventRepository from '../../repositories/events'
import { verifyScreenToken } from '../../utils/screenToken'

import type { NextFunction, Request, Response } from 'express'
import type { DocumentedMiddleware, ResponseConfig } from '@factories/defineAction/types'

export const screenSessionMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization
  const queryToken = typeof req.query.token === 'string' ? req.query.token : undefined
  const rawToken = authHeader?.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : queryToken

  if (!rawToken) {
    sendError({ code: 'no_token', res, local: 'screenSessionMiddleware' })
    return
  }

  const payload = verifyScreenToken(rawToken)
  if (!payload) {
    sendError({ code: 'token_is_not_valid', res, local: 'screenSessionMiddleware' })
    return
  }

  const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  const event = paramId
    ? await eventRepository.findByIdOrGuestToken(paramId)
    : await eventRepository.findById(payload.eventId)

  if (!event || payload.eventId !== event.id) {
    sendError({ code: 'token_is_not_valid', res, local: 'screenSessionMiddleware' })
    return
  }

  const slot = event.screens.find((item) => item.id === payload.screenId)

  if (!event || !slot || slot.isBlocked) {
    sendError({ code: 'token_is_not_valid', res, local: 'screenSessionMiddleware' })
    return
  }

  res.locals.screenId = slot.id
  next()
}

export const screenSessionResponses: Record<string, ResponseConfig> = {
  401: {
    description: 'Credencial do telão não fornecida, inválida ou desconectada',
    schema: errorResponseSchema
  }
}

export const screenSessionWithDocs: DocumentedMiddleware = Object.assign(screenSessionMiddleware, {
  authenticate: true,
  responses: screenSessionResponses
})

export default screenSessionWithDocs
