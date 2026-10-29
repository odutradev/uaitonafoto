import email from '@email/connect'

import type {
  ProcessTemplateResult,
  ProcessTemplateParams,
  SendEmailResult,
  SendEmailParams,
  LocalEmailTemplate,
  EnrichedEmailTemplate,
  SendEnrichedEmailParams
} from '@email/types'

export const processTemplate = ({ template, variables = {} }: ProcessTemplateParams): ProcessTemplateResult => {
  const processed = Object.entries(variables).reduce((acc, [key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    return acc.replace(regex, String(value))
  }, template)

  return { processed }
}

export const sendEmail = async ({ to, subject, template, variables, from }: SendEmailParams): Promise<SendEmailResult> => {
  try {
    const transporter = await email.getInstance()
    const { processed: processedSubject } = processTemplate({ template: subject, variables })
    const { processed } = processTemplate({ template, variables })

    const mailOptions = {
      from: from ?? process.env.EMAIL_FROM,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: processedSubject,
      markdown: processed
    }

    const info = await (transporter as any).sendMail(mailOptions)

    return { success: true, messageId: info.messageId }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const enrichTemplate = (templateDef: LocalEmailTemplate): EnrichedEmailTemplate => ({
  ...templateDef,
  send: async ({ to, variables, from }: SendEnrichedEmailParams): Promise<SendEmailResult> => {
    return sendEmail({
      to,
      subject: templateDef.subject,
      template: templateDef.markdownBody,
      variables,
      from
    })
  }
})
