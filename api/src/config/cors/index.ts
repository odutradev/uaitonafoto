import cors from 'cors'
import env from '@config/env'
import type { CorsMiddleware } from './types'

export const configureCors = (): CorsMiddleware => {
  const allowedOrigins = env.CORS_ORIGIN
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean)

  const allowAll = allowedOrigins.length === 0 || allowedOrigins.includes('*')

  return cors({
    credentials: true,
    origin: (requestOrigin, callback) => {
      if (allowAll || !requestOrigin) {
        callback(null, true)
        return
      }

      const normalizedOrigin = requestOrigin.replace(/\/+$/, '')

      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true)
        return
      }

      callback(new Error('Origin not allowed by CORS'))
    }
  })
}

export * from './types'
export default configureCors
