import 'dotenv/config'

import env from '@config/env'
import { registerDomains } from '@config/domain'
import usersDomain from '@domains/users'
import systemDomain from '@domains/system'
import { connectDatabase, disconnectDatabase } from '@database'
import { connectEmail } from '@email'
import { connectFirebase } from '@firebase'
import { connectPayment } from '@payment'
import createLogger from '@utils/logger'
import buildApp from '@/app'

import type { Server } from 'http'

const logger = createLogger('server')

const setupGracefulShutdown = (server: Server): void => {
  let isShuttingDown = false

  const handleShutdown = async (signal: NodeJS.Signals): Promise<void> => {
    if (isShuttingDown) return
    isShuttingDown = true

    logger.info(`Received ${signal}. Starting graceful shutdown...`)

    const forceExitTimer = setTimeout(() => {
      logger.error('Graceful shutdown timed out. Forcing exit...')
      process.exit(1)
    }, 10000)

    forceExitTimer.unref()

    server.close(async (err) => {
      if (err) {
        logger.error('Error closing HTTP server:', err)
      } else {
        logger.info('HTTP server closed')
      }

      try {
        await disconnectDatabase()
      } catch (dbErr) {
        logger.error('Error disconnecting database:', dbErr)
      }

      logger.success('Graceful shutdown completed successfully')
      clearTimeout(forceExitTimer)
      process.exit(0)
    })
  }

  process.on('SIGINT', () => {
    handleShutdown('SIGINT')
  })

  process.on('SIGTERM', () => {
    handleShutdown('SIGTERM')
  })
}

const startServer = async (): Promise<void> => {
  registerDomains([usersDomain, systemDomain])

  const app = buildApp()
  const port = env.PORT

  const server = app.listen(port, '0.0.0.0', async () => {
    logger.info(`uai to na foto API running on port ${port}`)

    await Promise.all([
      connectDatabase(),
      connectFirebase(),
      connectEmail(),
      connectPayment()
    ])
  })

  setupGracefulShutdown(server)
}

startServer().catch(logger.error)
