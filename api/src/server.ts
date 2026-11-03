import 'dotenv/config'

import { validateEnv } from '@config/env'
import { connectDatabase, isDatabaseConfigured } from '@database/connect'
import { connectEmail, isEmailConfigured } from '@email/connect'
import { connect as connectFirebase } from '@firebase/connect'
import usersDomain from '@domains/users'
import systemDomain from '@domains/system'
import createLogger from '@utils/logger'
import buildApp from '@/app'

import type { DomainDefinition } from '@domains/types'

const logger = createLogger('server')

export const registeredDomains: Map<string, DomainDefinition> = new Map()

export const registerDomain = (domain: DomainDefinition): void => {
  registeredDomains.set(domain.name, domain)
  const actionCount = Object.keys(domain.actions || {}).length
  logger.info(`Domain registered: [${domain.name}] with ${actionCount} actions`)
}

export const registerDomains = (): void => {
  registerDomain(usersDomain)
  registerDomain(systemDomain)
}

const startServer = async (): Promise<void> => {
  validateEnv()
  registerDomains()

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
