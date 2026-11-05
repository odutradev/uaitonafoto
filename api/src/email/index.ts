import nodemailer from 'nodemailer'

import { markdownPlugin } from '@email/markdownPlugin'
import env from '@config/env'
import createLogger from '@utils/logger'

import type { EmailTransporter, EmailInstance, EmailModule, EmailConfig } from '@email/types'

const logger = createLogger('email')

const email: EmailModule = {
  transporter: null,
  initializeEmail: async (): Promise<EmailInstance | null> => {
    if (!env.EMAIL_HOST || !env.EMAIL_PORT || !env.EMAIL_USER || !env.EMAIL_PASS) {
      logger.warn('Email service disabled: EMAIL_* variables are not configured')
      return null
    }

    try {
      const port = env.EMAIL_PORT

      const config: EmailConfig = {
        host: env.EMAIL_HOST,
        port,
        secure: port === 465,
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASS
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
