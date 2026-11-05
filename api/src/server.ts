import 'dotenv/config'

import env from '@config/env'
import { registerDomains } from '@config/domain'
import usersDomain from '@domains/users'
import systemDomain from '@domains/system'
import { connectDatabase } from '@database'
import { connectEmail } from '@email'
import { connectFirebase } from '@firebase'
import { connectPayment } from '@payment'
import createLogger from '@utils/logger'
import buildApp from '@/app'

const logger = createLogger('server')

const startServer = async (): Promise<void> => {
  registerDomains([usersDomain, systemDomain])

  const app = buildApp()
  const port = env.PORT

  app.listen(port, '0.0.0.0', async () => {
    logger.info(`uai to na foto API running on port ${port}`)

    await Promise.all([
      connectDatabase(),
      connectFirebase(),
      connectEmail(),
      connectPayment()
    ])
  })
}

startServer().catch(logger.error)
