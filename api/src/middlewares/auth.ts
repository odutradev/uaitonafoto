import jwt from 'jsonwebtoken'

import { getJwtSecret } from '@/config/env'
import { firebaseAuth } from '@/database/connection'
import sendError from '@/error/index'

import type { NextFunction, Response, Request } from 'express'

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    sendError({ code: 'no_token', res, local: 'authMiddleware' })
    
    return
  }

  const token = authHeader.split('Bearer ')[1]
  const secret = getJwtSecret()

  try {
    const decoded = jwt.verify(token, secret) as { sub: string }
    
    res.locals.userId = decoded.sub
    
    next()
  } catch {
    try {
      const decodedToken = await firebaseAuth.verifyIdToken(token)
      
      res.locals.userId = decodedToken.uid
      
      next()
    } catch (error) {
      sendError({ code: 'token_is_not_valid', res, error, local: 'authMiddleware' })
    }
  }
}

export default authMiddleware
