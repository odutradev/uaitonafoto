import 'dotenv/config'

import { registerRoutines, startRoutines, stopRoutines } from '@config/routine'
import { connectDatabase, disconnectDatabase } from '@database'
import suppressPunycodeWarning from '@utils/warning'
import { resolveAppVersion } from '@config/version'
import { closeAllRealtimeStreams } from '@realtime'
import paymentsRoutines from '@routines/payments'
import { registerDomains } from '@config/domain'
import paymentsDomain from '@domains/payments'
import eventsRoutines from '@routines/events'
import { connectFirebase } from '@firebase'
import systemDomain from '@domains/system'
import eventsDomain from '@domains/events'
import { connectPayment } from '@payment'
import usersDomain from '@domains/users'
import createLogger from '@utils/logger'
import { connectEmail } from '@email'
import env from '@config/env'
import buildApp from './app'

import type { Server } from 'http'

suppressPunycodeWarning()

const logger = createLogger('server')

const setupGracefulShutdown = (server: Server): void => {
  const shutdownState = { isShuttingDown: false }

  const handleShutdown = async (signal: NodeJS.Signals): Promise<void> => {
    if (shutdownState.isShuttingDown) return
    shutdownState.isShuttingDown = true

    logger.info(`Received ${signal}. Starting graceful shutdown...`)
    stopRoutines()
    closeAllRealtimeStreams()

    const forceExitTimer = setTimeout(() => {
      logger.error('Graceful shutdown timed out. Forcing exit...')
      process.exit(1)
    }, 10000)

    forceExitTimer.unref()

    server.close(async (err) => {
      if (err) logger.error('Error closing HTTP server:', err)
      if (!err) logger.info('HTTP server closed')

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
