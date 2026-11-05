import 'dotenv/config'

import env from '@config/env'
import { registerDomains, registerDomain, registeredDomains } from '@config/domain'
import { connectDatabase } from '@database'
import { connectEmail } from '@email/connect'
import { connect as connectFirebase } from '@firebase/connect'
import createLogger from '@utils/logger'
import buildApp from '@/app'

export { registerDomains, registerDomain, registeredDomains }

const logger = createLogger('server')

const startServer = async (): Promise<void> => {
  registerDomains()

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
