import 'dotenv/config'

import { validateEnv } from '@/config/env'
import { connectEmail } from '@/email/connect'
import database from '@/database/database'
import createLogger from '@/utils/logger'
import buildApp from '@/app'
import { startAutoResultSyncRoutine } from '@/services/autoResultSync'

const logger = createLogger('server')

const startServer = async (): Promise<void> => {
  validateEnv()

  const app = buildApp()
  const port = process.env.PORT ?? 3000

  app.listen(port, async () => {
    logger.info(`Server running on port ${port}`)

    await database.connect()
    await connectEmail()

    startAutoResultSyncRoutine()
  })
}

startServer().catch(logger.error)