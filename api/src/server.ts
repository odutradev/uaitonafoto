import 'dotenv/config'

import env from '@config/env'
import { registerDomains } from '@config/domain'
import usersDomain from '@domains/users'
import systemDomain from '@domains/system'
import { connectDatabase } from '@database'
import { connectEmail } from '@email'
import { connect as connectFirebase } from '@firebase'
import createLogger from '@utils/logger'
import buildApp from '@/app'

const logger = createLogger('server')

const startServer = async (): Promise<void> => {
  registerDomains([usersDomain, systemDomain])

  const app = buildApp()
  const port = env.PORT

  app.listen(port, '0.0.0.0', async () => {
    logger.info(`uai to na foto API running on port ${port}`)

    try {
      await connectDatabase()
    } catch (err) {
      logger.error('Failed to connect MongoDB database:', err)
    }

    await connectFirebase()

    if (env.EMAIL_HOST && env.EMAIL_PORT && env.EMAIL_USER && env.EMAIL_PASS) {
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
