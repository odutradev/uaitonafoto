import 'dotenv/config'

import { validateEnv } from '@config/env'
import { connectDatabase, isDatabaseConfigured } from '@database'
import { connectEmail, isEmailConfigured } from '@email/connect'
import { connect as connectFirebase } from '@firebase'
import createLogger from '@utils/logger'
import buildApp from '@/app'

const logger = createLogger('server')

const startServer = async (): Promise<void> => {
  validateEnv()

  const app = buildApp()
  const port = Number(process.env.PORT) || 3000

  app.listen(port, '0.0.0.0', async () => {
    logger.info(`uai to na foto API running on port ${port}`)

    if (isDatabaseConfigured()) {
      try {
        await connectDatabase()
      } catch (err) {
        logger.error('Failed to connect MongoDB database:', err)
      }
    } else {
      logger.warn('Database disabled: MONGODB_URI is not configured')
    }

    await connectFirebase()

    if (isEmailConfigured()) {
      try {
        await connectEmail()
      } catch (err) {
        logger.error('Failed to connect email service:', err)
      }
    } else {
      logger.warn('Email service disabled: EMAIL_* variables are not configured')
    }
  })
}

startServer().catch(logger.error)
