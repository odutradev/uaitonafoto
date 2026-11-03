import sendError from '@error/index'
import type { NextFunction, Response, Request } from 'express'
import type { RequiredPermissions } from './types'

const requirePermissions = (permissions: RequiredPermissions) => {
  return async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
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
}


export default requirePermissions
