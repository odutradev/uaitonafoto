import sendError from '@error/index'
import userRepository from '../../repositories'

import type { NextFunction, Response, Request } from 'express'
import type { ResponseConfig } from '@factories/defineAction/types'

export const adminMiddleware = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = res.locals?.userId

  if (!userId) {
    sendError({ code: 'unauthorized', res, local: 'adminMiddleware' })
    return
  }

  try {
    const user = await userRepository.findById(userId)

    if (!user || user.role !== 'admin') {
      sendError({ code: 'forbidden', res, local: 'adminMiddleware' })
      return
    }

    next()
  } catch (error) {
    sendError({ code: 'internal_error', res, error, local: 'adminMiddleware' })
  }
}

export const adminMiddlewareResponses: Record<string, ResponseConfig> = {
  401: { description: 'Token de autenticação não fornecido ou inválido' },
  403: { description: 'Acesso negado: requer perfil administrador' }
}

Object.assign(adminMiddleware, {
  authenticate: true,
  responses: adminMiddlewareResponses
})

export default adminMiddleware
