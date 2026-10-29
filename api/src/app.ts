import express from 'express'
import helmet from 'helmet'

import { globalRateLimiter } from '@/middlewares/rateLimit'
import registerGlobalRoutes from '@/routes/index'
import configureCors from '@/config/cors'

import type { Application } from 'express'

const buildApp = (): Application => {
  const app = express()

  app.disable('x-powered-by')
  app.set('trust proxy', 1)

  app.use(
    helmet({
      frameguard: { action: 'deny' },
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false
    })
  )
  app.use(globalRateLimiter)
  app.use(configureCors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  registerGlobalRoutes(app)

  return app
}

export default buildApp