import { sendSubscriptionRenewalReminderEmail } from '@domains/payments/utils/notifySubscriptionEmail'
import subscriptionRepository from '@domains/payments/repositories/subscriptions'
import { defineRoutine } from '@config/routine'
import { BrazilTimeZone } from '@utils/date'
import runSequentially from '@utils/async'
import createLogger from '@utils/logger'

const logger = createLogger('payments:renewal-reminder-routine')

export const RenewalReminderDaysAhead = 3

const DayMs = 24 * 60 * 60 * 1000

export const runRemindSubscriptionRenewals = async (): Promise<void> => {
  const now = Date.now()
  const dueSubscriptions = await subscriptionRepository.listDueForRenewalReminder(
    new Date(now).toISOString(),
    new Date(now + RenewalReminderDaysAhead * DayMs).toISOString()
  )

  const reminderResults = await runSequentially(dueSubscriptions, async (subscription) => {
    if (!subscription.nextBillingAt) return false

    const isSent = await sendSubscriptionRenewalReminderEmail(subscription, subscription.nextBillingAt)
    if (!isSent) return false

    await subscriptionRepository.markRenewalReminderSent(subscription.id, subscription.nextBillingAt)
    return true
  })

  const sentCount = reminderResults.filter(Boolean).length
  if (sentCount > 0) {
    logger.info(`Routine completed: ${sentCount} renewal reminders sent.`)
  }
}

export const remindSubscriptionRenewalsRoutine = defineRoutine({
  name: 'remindSubscriptionRenewals',
  description: 'Email subscribers a few days before their next recurring charge',
  cronExpression: '0 10 * * *',
  timezone: BrazilTimeZone,
  runOnInit: false,
  handler: runRemindSubscriptionRenewals
})

export default remindSubscriptionRenewalsRoutine
