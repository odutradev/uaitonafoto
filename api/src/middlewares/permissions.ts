import sendError from '@error'

import type { NextFunction, Response, Request } from 'express'

const requirePermissions = (permissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = res.locals?.userId

    if (!userId) {
      sendError({ code: 'unauthorized', res, local: 'requirePermissions' })
      
      return
    }

    next()
  }
}

export default requirePermissions
