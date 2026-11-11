import adminAlertEmail from '@domains/system/emails/adminAlert'
import userRepository from '@domains/users/repositories/users'
import { buildFrontendUrl } from '@email/links'
import { formatDateTimeBR } from '@utils/date'
import runSequentially from '@utils/async'
import createLogger from '@utils/logger'

import type { EmailDetailItem } from '@email/builder/types'

const logger = createLogger('system:admin-alerts')

export const AdminAlertThrottleMs = 60 * 60 * 1000

const lastAlertSentAt = new Map<string, number>()

export interface AdminAlertParams {
  key: string
  title: string
  description: string
  details?: EmailDetailItem[]
}

const isThrottled = (key: string, now: number): boolean => {
  const lastSentAt = lastAlertSentAt.get(key)
  return lastSentAt !== undefined && now - lastSentAt < AdminAlertThrottleMs
}

export const notifyAdmins = async ({ key, title, description, details = [] }: AdminAlertParams): Promise<void> => {
  const now = Date.now()
  if (isThrottled(key, now)) return

  lastAlertSentAt.set(key, now)

  try {
    const admins = await userRepository.listByRole('admin')

    await runSequentially(admins, (admin) =>
      adminAlertEmail.send({
        to: admin.email,
        variables: {
          adminName: admin.fullName || admin.name,
          title,
          description,
          occurredAt: formatDateTimeBR(new Date(now)),
          details,
          logsUrl: buildFrontendUrl('/app/logs')
        }
      })
    )
  } catch (error) {
    logger.warn(`Failed to notify admins about "${key}":`, error)
  }
}

export default notifyAdmins
