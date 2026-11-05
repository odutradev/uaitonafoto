import sendError from '@error/index'
import { errorResponseSchema } from '@factories/errors/schemas'
import userRepository from '../../repositories'

import type { NextFunction, Response, Request } from 'express'
import type { DocumentedMiddleware, ResponseConfig } from '@factories/defineAction/types'

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
  401: {
    description: 'Token de autenticação não fornecido ou inválido',
    schema: errorResponseSchema
  },
  403: {
    description: 'Acesso negado: requer perfil administrador',
    schema: errorResponseSchema
  }
}

export const adminMiddlewareWithDocs: DocumentedMiddleware = Object.assign(adminMiddleware, {
  authenticate: true,
  responses: adminMiddlewareResponses
})

export default adminMiddlewareWithDocs
