import subscriptionActivatedEmail from '@domains/payments/emails/subscriptionActivated'
import { formatPaymentMethodLabel, resolveCheckoutExpirationHours } from './emailFormat'
import transactionRepository from '@domains/payments/repositories/transactions'
import purchaseConfirmedEmail from '@domains/payments/emails/purchaseConfirmed'
import paymentPendingEmail from '@domains/payments/emails/paymentPending'
import paymentExpiredEmail from '@domains/payments/emails/paymentExpired'
import { formatDateBR, formatDateTimeBR } from '@utils/date'
import { formatCurrencyBRL } from '@utils/currency'
import { buildFrontendUrl } from '@email/links'

import type { SubscriptionEntity } from '@domains/payments/repositories/subscriptions/types'
import type { TransactionEntity } from '@domains/payments/repositories/transactions/types'

const HourMs = 60 * 60 * 1000

export const sendPaymentPendingEmail = async (transaction: TransactionEntity, checkoutUrl: string, methods: string[]): Promise<void> => {
  const expiresAt = new Date(new Date(transaction.createdAt).getTime() + resolveCheckoutExpirationHours() * HourMs)

  await paymentPendingEmail.send({
    to: transaction.userEmail,
    variables: {
      userName: transaction.userName,
      planName: transaction.planName,
      amountFormatted: formatCurrencyBRL(transaction.amount),
      checkoutUrl,
      expiresAt: formatDateTimeBR(expiresAt),
      isPixAvailable: methods.includes('PIX')
    }
  })
}

export const sendPaymentConfirmedEmail = async (
  transaction: TransactionEntity,
  creditsAdded: number,
  subscription: SubscriptionEntity | null
): Promise<void> => {
  const amountFormatted = formatCurrencyBRL(transaction.paidAmount ?? transaction.amount)
  const paymentMethodLabel = formatPaymentMethodLabel(transaction.paymentMethod)

  if (transaction.planType === 'SUBSCRIPTION') {
    await subscriptionActivatedEmail.send({
      to: transaction.userEmail,
      variables: {
        userName: transaction.userName,
        planName: transaction.planName,
        amountFormatted,
        creditsAdded,
        paymentMethodLabel,
        nextBillingDate: subscription?.nextBillingAt ? formatDateBR(new Date(subscription.nextBillingAt)) : undefined,
        appUrl: buildFrontendUrl('/app')
      }
    })
    return
  }

  await purchaseConfirmedEmail.send({
    to: transaction.userEmail,
    variables: {
      userName: transaction.userName,
      planName: transaction.planName,
      amountFormatted,
      creditsAdded,
      paymentMethodLabel,
      paidAt: formatDateTimeBR(new Date(transaction.paidAt ?? Date.now())),
      receiptUrl: transaction.receiptUrl,
      appUrl: buildFrontendUrl('/app')
    }
  })
}

const hasLaterPaidTransaction = async (transaction: TransactionEntity): Promise<boolean> => {
  const userTransactions = await transactionRepository.listByUser(transaction.userId)
  return userTransactions.some(
    (candidate) =>
      candidate.status === 'PAID' &&
      candidate.planId === transaction.planId &&
      new Date(candidate.createdAt).getTime() > new Date(transaction.createdAt).getTime()
  )
}

export const sendPaymentExpiredEmail = async (transaction: TransactionEntity): Promise<void> => {
  if (await hasLaterPaidTransaction(transaction)) return

  await paymentExpiredEmail.send({
    to: transaction.userEmail,
    variables: {
      userName: transaction.userName,
      planName: transaction.planName,
      amountFormatted: formatCurrencyBRL(transaction.amount),
      billingUrl: buildFrontendUrl('/app/billing')
    }
  })
}
