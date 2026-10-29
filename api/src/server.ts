import 'dotenv/config'

import { validateEnv } from '@config/env'
import { connectEmail, isEmailConfigured } from '@email'
import database from '@database'
import createLogger from '@utils/logger'
import buildApp from '@/app'

const logger = createLogger('server')

const startServer = async (): Promise<void> => {
  validateEnv()

  const app = buildApp()
  const port = process.env.PORT ?? 3000

  app.listen(port, async () => {
    logger.info(`uai to na foto API running on port ${port}`)

    await database.connect()

    if (isEmailConfigured()) {
      await connectEmail()
    } else {
      logger.warn('Email service disabled: EMAIL_* variables are not configured')
    }
  })
}

startServer().catch(logger.error)
