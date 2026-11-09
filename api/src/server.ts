import 'dotenv/config'
import suppressPunycodeWarning from '@utils/warning'

suppressPunycodeWarning()

import env from '@config/env'
import { resolveAppVersion } from '@config/version'
import { registerDomains } from '@config/domain'
import { registerRoutines, startRoutines, stopRoutines } from '@config/routine'
import usersDomain from '@domains/users'
import systemDomain from '@domains/system'
import paymentsDomain from '@domains/payments'
import eventsDomain from '@domains/events'
import { closeAllEventStreams } from '@domains/events/utils/eventStream'
import paymentsRoutines from '@routines/payments'
import eventsRoutines from '@routines/events'
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
    stopRoutines()
    closeAllEventStreams()

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
  const version = resolveAppVersion()
  registerDomains([usersDomain, systemDomain, paymentsDomain, eventsDomain])
  registerRoutines([paymentsRoutines, eventsRoutines])

  const app = buildApp()
  const port = env.PORT

  const server = app.listen(port, '0.0.0.0', async () => {
    logger.info(`API v${version} running on port ${port}`)

    await Promise.all([
      connectDatabase(),
      connectFirebase(),
      connectEmail(),
      connectPayment()
    ])

    startRoutines()
  })

  setupGracefulShutdown(server)
}

startServer().catch(logger.error)
