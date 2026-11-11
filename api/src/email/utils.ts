import email, { checkEmailHealth } from '@email'
import createLogger from '@utils/logger'
import buildEmail from '@email/builder'
import env from '@config/env'

import type { SendEnrichedEmailParams, SendEmailResult, SendEmailParams, EmailDefinition, EnrichedEmail } from '@email/types'

const logger = createLogger('email:send')

const UndeliverableAddresses = ['unknown@user']

const isDeliverableAddress = (address: string): boolean => address.includes('@') && !UndeliverableAddresses.includes(address)

export const sendEmail = async ({ to, subject, html, text, from }: SendEmailParams): Promise<SendEmailResult> => {
  const recipients = (Array.isArray(to) ? to : [to]).map((address) => address.trim()).filter(isDeliverableAddress)

  if (checkEmailHealth() === 'disabled') return { success: false, error: 'email_disabled' }
  if (recipients.length === 0) return { success: false, error: 'invalid_recipient' }

  try {
    const transporter = await email.getInstance()

    const info = await transporter.sendMail({
      from: from ?? env.EMAIL_FROM,
      to: recipients.join(', '),
      subject,
      html,
      text
    })

    return { success: true, messageId: info.messageId }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    logger.warn(`Failed to send "${subject}" to ${recipients.join(', ')}: ${message}`)
    return { success: false, error: message }
  }
}

export const enrichEmail = <Variables>(definition: EmailDefinition<Variables>): EnrichedEmail<Variables> => {
  const render = (variables: Variables) => ({
    subject: definition.subject(variables),
    ...buildEmail(definition.build(variables))
  })

  return {
    ...definition,
    render,
    send: async ({ to, variables, from }: SendEnrichedEmailParams<Variables>): Promise<SendEmailResult> => {
      const { subject, html, text } = render(variables)
      return sendEmail({ to, subject, html, text, from })
    }
  }
}
