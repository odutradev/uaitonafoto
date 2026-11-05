import sendError from '@error/index'
import type { NextFunction, Response, Request } from 'express'
import type { RequiredPermissions } from './types'
import type { ResponseConfig } from '@factories/defineAction/types'

export const permissionResponses: Record<string, ResponseConfig> = {
  401: { description: 'Token de autenticação não fornecido ou inválido' },
  403: { description: 'Acesso negado: permissões insuficientes' }
}

const requirePermissions = (permissions: RequiredPermissions) => {
  const middleware = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = res.locals?.userId

    if (!userId) {
      sendError({ code: 'unauthorized', res, local: 'requirePermissions' })
      return
    }

    if (!permissions || permissions.length === 0) {
      next()
      return
    }

    next()
  }

  return Object.assign(middleware, {
    authenticate: true,
    responses: permissionResponses
  })
}

export default requirePermissions
