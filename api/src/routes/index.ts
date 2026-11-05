import swaggerUi from 'swagger-ui-express'

import { generateDocs } from '@config/docs'
import env from '@config/env'
import createApiRouter from '@routes/api'
import { checkDatabaseHealth } from '@database'
import { checkFirebaseHealth } from '@firebase'
import { checkEmailHealth } from '@email'
import { checkPaymentHealth } from '@payment'

import type { Application, Response, Request, NextFunction } from 'express'

const ensureTrailingSlash = (req: Request, res: Response, next: NextFunction): void => {
  const forwardedPrefix = ((req.headers['x-forwarded-prefix'] as string) || '').replace(/\/$/, '')
  const pathWithoutQuery = req.originalUrl.split('?')[0]

  if (req.path === '' || req.path === '/') {
    if (!pathWithoutQuery.endsWith('/')) {
      const queryString = req.originalUrl.includes('?') ? `?${req.originalUrl.split('?')[1]}` : ''
      const prefix = forwardedPrefix && !pathWithoutQuery.startsWith(forwardedPrefix) ? forwardedPrefix : ''
      const target = `${prefix}${pathWithoutQuery}/${queryString}`
      res.redirect(301, target)
      return
    }
  }

  next()
}

const registerGlobalRoutes = (app: Application): void => {
  app.get(['/health', '/api/health'], (_req: Request, res: Response) => {
    const services = {
      database: checkDatabaseHealth(),
      firebase: checkFirebaseHealth(),
      email: checkEmailHealth(),
      payment: checkPaymentHealth()
    }

    const isHealthy = services.database === 'ok' && services.firebase === 'ok'

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'ok' : 'degraded',
      mode: env.NODE_ENV,
      version: '1.0.0',
      services
    })
  })

  app.get(['/ping', '/api/ping'], (_req: Request, res: Response) => {
    res.status(200).send('pong')
  })

  const apiRouter = createApiRouter()

  app.use('/', apiRouter)
  app.use('/api', apiRouter)

  const isSwaggerEnabled = env.SWAGGER_ENABLED !== 'false'

  if (isSwaggerEnabled) {
    const spec = generateDocs()
    const swaggerMiddleware = [
      ensureTrailingSlash,
      ...swaggerUi.serve,
      swaggerUi.setup(spec, { swaggerOptions: { persistAuthorization: true } })
    ]

    app.get(['/docs.json', '/api/docs.json'], (_req: Request, res: Response) => {
      res.status(200).json(spec)
    })

    app.use('/docs', ...swaggerMiddleware)
    app.use('/api/docs', ...swaggerMiddleware)
  }
}

export default registerGlobalRoutes