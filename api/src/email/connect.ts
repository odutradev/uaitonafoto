import nodemailer from 'nodemailer'

import { markdownPlugin } from '@email/markdownPlugin'
import { validateEnvVars } from '@utils/env'
import createLogger from '@utils/logger'

import type { EmailTransporter, EmailInstance, EmailModule, EmailConfig } from '@email/types'

const logger = createLogger('email')

const REQUIRED_ENV_VARS = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS']

export const isEmailConfigured = (): boolean => validateEnvVars(REQUIRED_ENV_VARS).isValid

const email: EmailModule = {
  transporter: null,
  initializeEmail: async (): Promise<EmailInstance> => {
    const { isValid, missing } = validateEnvVars(REQUIRED_ENV_VARS)

    if (!isValid) {
      throw new Error(`Missing email environment variables: ${missing.join(', ')}`)
    }

    try {
      const port = Number(process.env.EMAIL_PORT)

      const config: EmailConfig = {
        host: process.env.EMAIL_HOST as string,
        port,
        secure: port === 465,
        auth: {
          user: process.env.EMAIL_USER as string,
          pass: process.env.EMAIL_PASS as string
        }
      }

      email.transporter = nodemailer.createTransport(config)
      email.transporter.use('compile', markdownPlugin())

      logger.info('Email service initialized successfully with markdown support')

      return { transporter: email.transporter }
    } catch (error) {
      logger.error('[initializeEmail] Email initialization error')
      logger.clean(error)
      process.exit(1)
    }
  },
  getInstance: async (): Promise<EmailTransporter> => {
    if (!email.transporter) {
      logger.info('[getInstance] Email not initialized, initializing now')
      await email.initializeEmail()
      if (!email.transporter) {
        logger.error('[getInstance] Failed to initialize email transporter')
        throw new Error('Failed to initialize email transporter')
      }
    }
    return email.transporter
  }
}

export const connectEmail = email.initializeEmail

export default email
