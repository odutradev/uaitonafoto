import type { EmailDetailItem } from '@email/builder/types'

export type AdminAlertEmailVariables = {
  adminName: string
  title: string
  description: string
  occurredAt: string
  details: EmailDetailItem[]
  logsUrl: string
}
