import buildEmail from '@email/builder'
import env from '@config/env'
import email from '@email'

import type { SendEnrichedEmailParams, SendEmailResult, SendEmailParams, EmailDefinition, EnrichedEmail } from '@email/types'

export const sendEmail = async ({ to, subject, html, text, from }: SendEmailParams): Promise<SendEmailResult> => {
  try {
    const transporter = await email.getInstance()

    const info = await transporter.sendMail({
      from: from ?? env.EMAIL_FROM,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
      text
    })

    return { success: true, messageId: info.messageId }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
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
