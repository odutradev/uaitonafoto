import { marked } from 'marked'

import type { MarkdownMailOptions } from '@email/types'
import type Mail from 'nodemailer/lib/mailer'

export const markdownPlugin = (): Mail.PluginFunction => {
  return (mail, callback) => {
    const data = mail.data as MarkdownMailOptions

    if (!data?.markdown || data.html) return callback()

    mail.resolveContent(data, 'markdown', async (err: Error | null, markdownContent: string | Buffer) => {
      if (err) return callback(err)

      try {
        const text = (markdownContent || '').toString()
        data.html = await marked.parse(text)
        if (!data.text) data.text = text
        callback(null)
      } catch (parseError) {
        callback(parseError as Error)
      }
    })
  }
}
