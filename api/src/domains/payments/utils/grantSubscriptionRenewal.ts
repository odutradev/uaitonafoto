import subscriptionRepository from '@domains/payments/repositories/subscriptions'
import transactionRepository from '@domains/payments/repositories/transactions'
import purchaseRepository from '@domains/payments/repositories/purchases'
import { sendSubscriptionRenewedEmail } from './notifySubscriptionEmail'
import userRepository from '@domains/users/repositories/users'
import computeNextBillingDate from './computeNextBillingDate'
import logRepository from '@domains/system/repositories/logs'
import { resolveFrontendBaseUrl } from '@email/links'
import { getPlanByProductId } from '@payment/plans'
import createLogger from '@utils/logger'

import type { TransactionWebhookEvent } from '@domains/payments/repositories/transactions/types'
import type { SubscriptionEntity } from '@domains/payments/repositories/subscriptions/types'
import type { CachedPlan } from '@payment/plans/types'

const logger = createLogger('payments:renewal')

const isDuplicateKeyError = (error: unknown): boolean => (error as { code?: number })?.code === 11000

export interface GrantSubscriptionRenewalParams {
  subscription: SubscriptionEntity
  externalPaymentId: string
  paidAt?: string
  amount?: number
  paidAmount?: number
  platformFee?: number
  receiptUrl?: string
  paymentMethod?: string
  payerInformation?: unknown
  frequency?: string
  webhookEvent?: TransactionWebhookEvent
}

export const grantSubscriptionRenewal = async ({
  subscription,
  externalPaymentId,
  paidAt,
  amount,
  paidAmount,
  platformFee,
  receiptUrl,
  paymentMethod,
  payerInformation,
  frequency,
  webhookEvent
}: GrantSubscriptionRenewalParams): Promise<boolean> => {
  const existingTransaction = await transactionRepository.findByExternalPaymentId(externalPaymentId)

  if (existingTransaction) {
    if (webhookEvent) {
      await transactionRepository.appendWebhookEvent(existingTransaction.id, webhookEvent)
    }
    return false
  }

  const [user, initialTx] = await Promise.all([
    userRepository.findById(subscription.userId),
    transactionRepository.findById(subscription.initialTransactionId)
  ])

  const userEmail = user?.email ?? initialTx?.userEmail ?? 'unknown@user'
  const userName = user?.fullName || user?.name || initialTx?.userName || 'Usuário'

  const snapshot = (subscription.planSnapshot as CachedPlan | undefined) ?? getPlanByProductId(subscription.planId)
  const resolvedPaidAt = paidAt ?? new Date().toISOString()
  const resolvedAmount = amount ?? subscription.amount
  const resolvedFrequency = frequency ?? subscription.frequency
  const resolvedMethod = paymentMethod ?? subscription.method

  const renewalTransaction = await transactionRepository
    .createPaid({
      userId: subscription.userId,
      userEmail,
      userName,
      planId: subscription.planId,
      planType: 'SUBSCRIPTION',
      planName: subscription.planName,
      planSnapshot: snapshot ?? subscription.planSnapshot,
      quantity: 1,
      amount: resolvedAmount,
      currency: subscription.currency,
      gateway: 'abacatepay',
      checkoutId: subscription.checkoutId,
      customerId: subscription.customerId,
      subscriptionId: subscription.subscriptionId,
      externalPaymentId,
      methods: resolvedMethod ? [resolvedMethod] : [],
      paymentMethod: resolvedMethod,
      paidAmount: paidAmount ?? resolvedAmount,
      platformFee,
      receiptUrl,
      payerInformation,
      devMode: subscription.devMode,
      webhookEvents: webhookEvent ? [webhookEvent] : [],
      paidAt: resolvedPaidAt
    })
    .catch((error: unknown) => {
      if (isDuplicateKeyError(error)) return null
      throw error
    })

  if (!renewalTransaction) return false

  const creditsToGrant = snapshot?.credits ?? subscription.creditsPerCycle

  await purchaseRepository.create({
    userId: subscription.userId,
    transactionId: renewalTransaction.id,
    subscriptionId: subscription.subscriptionId,
    planId: subscription.planId,
    planType: 'SUBSCRIPTION',
    planName: subscription.planName,
    abacateProductId: subscription.abacateProductId,
    planSnapshot: snapshot ?? subscription.planSnapshot,
    amount: resolvedAmount,
    currency: subscription.currency,
    credits: creditsToGrant,
    creditType: 'paid',
    extraStorageDays: snapshot?.extraStorageDays ?? 0
  })

  if (creditsToGrant > 0) {
    await userRepository.addCredits(subscription.userId, 'paid', creditsToGrant)
  }

  const nextBillingAt = computeNextBillingDate(resolvedPaidAt, resolvedFrequency)

  await subscriptionRepository.recordRenewal(subscription.id, {
    lastPaidAt: resolvedPaidAt,
    nextBillingAt,
    method: resolvedMethod
  })

  await sendSubscriptionRenewedEmail({
    userEmail,
    userName,
    planName: subscription.planName,
    amount: resolvedAmount,
    creditsAdded: creditsToGrant,
    nextBillingAt,
    baseUrl: resolveFrontendBaseUrl(initialTx?.completionUrl, initialTx?.returnUrl)
  })

  logger.success(
    `Subscription renewed: ${subscription.subscriptionId}, +${creditsToGrant} paid credits accumulated for user ${subscription.userId}`
  )

  logRepository.create({
    category: 'system',
    level: 'info',
    action: 'SUBSCRIPTION_RENEWED',
    title: 'Renovação de assinatura confirmada',
    description: `Créditos mensais de ${subscription.planName} adicionados para ${userEmail}`,
    userId: subscription.userId,
    userEmail,
    targetId: subscription.subscriptionId,
    targetName: subscription.planName,
    details: {
      transactionId: renewalTransaction.id,
      externalPaymentId,
      amount: resolvedAmount,
      credits: creditsToGrant
    }
  })

  return true
}

export default grantSubscriptionRenewal
