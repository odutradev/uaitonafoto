import sendError from '@error/index'
import userRepository from '../../repositories'

import type { NextFunction, Response, Request } from 'express'

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


export default adminMiddleware
