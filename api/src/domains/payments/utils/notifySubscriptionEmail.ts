import subscriptionRenewalReminderEmail from '@domains/payments/emails/subscriptionRenewalReminder'
import subscriptionPaymentFailedEmail from '@domains/payments/emails/subscriptionPaymentFailed'
import subscriptionCancelledEmail from '@domains/payments/emails/subscriptionCancelled'
import subscriptionRenewedEmail from '@domains/payments/emails/subscriptionRenewed'
import transactionRepository from '@domains/payments/repositories/transactions'
import userRepository from '@domains/users/repositories/users'
import { formatPaymentMethodLabel } from './emailFormat'
import { formatCurrencyBRL } from '@utils/currency'
import { buildFrontendUrl } from '@email/links'
import { formatDateBR } from '@utils/date'

import type { SubscriptionEntity } from '@domains/payments/repositories/subscriptions/types'

const DayMs = 24 * 60 * 60 * 1000

type Subscriber = {
  email: string
  name: string
}

const resolveSubscriber = async (subscription: SubscriptionEntity): Promise<Subscriber | null> => {
  const user = await userRepository.findById(subscription.userId)
  const initialTransaction = user ? null : await transactionRepository.findById(subscription.initialTransactionId)

  const email = user?.email ?? initialTransaction?.userEmail
  if (!email) return null

  return { email, name: user?.fullName || user?.name || initialTransaction?.userName || 'Assinante' }
}

export interface SendRenewedEmailParams {
  userEmail: string
  userName: string
  planName: string
  amount: number
  creditsAdded: number
  nextBillingAt: string
}

export const sendSubscriptionRenewedEmail = async ({
  userEmail,
  userName,
  planName,
  amount,
  creditsAdded,
  nextBillingAt
}: SendRenewedEmailParams): Promise<void> => {
  await subscriptionRenewedEmail.send({
    to: userEmail,
    variables: {
      userName,
      planName,
      amountFormatted: formatCurrencyBRL(amount),
      creditsAdded,
      nextBillingDate: formatDateBR(new Date(nextBillingAt)),
      appUrl: buildFrontendUrl('/app')
    }
  })
}

export const sendSubscriptionPaymentFailedEmail = async (subscription: SubscriptionEntity, method?: string): Promise<void> => {
  const subscriber = await resolveSubscriber(subscription)
  if (!subscriber) return

  await subscriptionPaymentFailedEmail.send({
    to: subscriber.email,
    variables: {
      userName: subscriber.name,
      planName: subscription.planName,
      amountFormatted: formatCurrencyBRL(subscription.amount),
      paymentMethodLabel: formatPaymentMethodLabel(method ?? subscription.method),
      appUrl: buildFrontendUrl('/app/billing')
    }
  })
}

export const sendSubscriptionCancelledEmail = async (subscription: SubscriptionEntity): Promise<void> => {
  const subscriber = await resolveSubscriber(subscription)
  if (!subscriber) return

  const hasFutureBilling = subscription.nextBillingAt && new Date(subscription.nextBillingAt).getTime() > Date.now()

  await subscriptionCancelledEmail.send({
    to: subscriber.email,
    variables: {
      userName: subscriber.name,
      planName: subscription.planName,
      validUntil: hasFutureBilling && subscription.nextBillingAt ? formatDateBR(new Date(subscription.nextBillingAt)) : undefined,
      billingUrl: buildFrontendUrl('/app/billing')
    }
  })
}

export const sendSubscriptionRenewalReminderEmail = async (subscription: SubscriptionEntity, billingAt: string): Promise<boolean> => {
  const subscriber = await resolveSubscriber(subscription)
  if (!subscriber) return false

  const daysUntilBilling = Math.max(0, Math.ceil((new Date(billingAt).getTime() - Date.now()) / DayMs))

  const result = await subscriptionRenewalReminderEmail.send({
    to: subscriber.email,
    variables: {
      userName: subscriber.name,
      planName: subscription.planName,
      amountFormatted: formatCurrencyBRL(subscription.amount),
      billingDate: formatDateBR(new Date(billingAt)),
      daysUntilBilling,
      paymentMethodLabel: formatPaymentMethodLabel(subscription.method),
      billingUrl: buildFrontendUrl('/app/billing')
    }
  })

  return result.success
}
