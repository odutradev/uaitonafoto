import type { EmailContent, RenderedEmail } from '@email/builder/types'
import type { Transporter } from 'nodemailer'

export type EmailTransporter = Transporter

export type EmailConfig = {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

export type EmailInstance = {
  transporter: EmailTransporter
}

export type EmailModule = {
  transporter: EmailTransporter | null
  initializeEmail: () => Promise<EmailInstance | null>
  getInstance: () => Promise<EmailTransporter>
}

export type SendEmailParams = {
  to: string | string[]
  subject: string
  html: string
  text: string
  from?: string
}

export type SendEmailResult = {
  success: boolean
  messageId?: string
  error?: string
}

export type EmailDefinition<Variables> = {
  subject: (variables: Variables) => string
  build: (variables: Variables) => EmailContent
}

export type SendEnrichedEmailParams<Variables> = {
  to: string | string[]
  variables: Variables
  from?: string
}

export type EnrichedEmail<Variables> = EmailDefinition<Variables> & {
  render: (variables: Variables) => RenderedEmail & { subject: string }
  send: (params: SendEnrichedEmailParams<Variables>) => Promise<SendEmailResult>
}
