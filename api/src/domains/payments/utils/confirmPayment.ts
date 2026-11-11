import transactionRepository from '@domains/payments/repositories/transactions'
import purchaseRepository from '@domains/payments/repositories/purchases'
import ensureSubscriptionRecord from './ensureSubscriptionRecord'
import userRepository from '@domains/users/repositories/users'
import logRepository from '@domains/system/repositories/logs'
import createLogger from '@utils/logger'

import type { TransactionEntity } from '@domains/payments/repositories/transactions/types'
import type { WebhookEventData } from '@domains/payments/actions/webhook/types'
import type { CachedPlan } from '@payment/plans/types'

const logger = createLogger('payments:confirm')

const isDuplicateKeyError = (error: unknown): boolean => (error as { code?: number })?.code === 11000

export const confirmPayment = async (transaction: TransactionEntity, data: WebhookEventData): Promise<void> => {
  const { checkout, payment, subscription } = data
  const payerInformation = data.payerInformation ?? checkout?.payerInformation
  const paymentMethod = data.payerInformation?.method ?? subscription?.method

  const claimed = await transactionRepository.transitionStatus(transaction.id, ['PENDING', 'EXPIRED', 'CANCELLED'], {
    status: 'PAID',
    paidAt: new Date().toISOString(),
    paidAmount: payment?.paidAmount ?? checkout?.paidAmount ?? transaction.amount,
    platformFee: payment?.platformFee ?? checkout?.platformFee ?? undefined,
    receiptUrl: payment?.receiptUrl ?? checkout?.receiptUrl ?? undefined,
    paymentMethod,
    payerInformation,
    subscriptionId: subscription?.id,
    externalPaymentId: payment?.id
  })

  const storedTransaction = claimed ?? (await transactionRepository.findById(transaction.id))
  if (storedTransaction?.status !== 'PAID') return

  const paymentId = payment?.id
  const shouldLinkPayment = !claimed && paymentId && !storedTransaction.externalPaymentId
  const current = shouldLinkPayment
    ? (await transactionRepository.update(storedTransaction.id, { externalPaymentId: paymentId })) ?? storedTransaction
    : storedTransaction

  const subscriptionRecord =
    current.planType === 'SUBSCRIPTION'
      ? await ensureSubscriptionRecord(current, subscription)
      : null

  const plan = transaction.planSnapshot as CachedPlan

  try {
    await purchaseRepository.create({
      userId: transaction.userId,
      transactionId: transaction.id,
      subscriptionId: subscriptionRecord?.subscriptionId ?? subscription?.id,
      planId: transaction.planId,
      planType: transaction.planType,
      planName: transaction.planName,
      abacateProductId: plan.abacateProductId,
      planSnapshot: plan,
      amount: transaction.amount,
      currency: transaction.currency,
      credits: plan.credits,
      creditType: 'paid',
      extraStorageDays: plan.extraStorageDays ?? 0
    })
  } catch (error) {
    if (isDuplicateKeyError(error)) return
    throw error
  }

  if (plan.credits > 0) {
    await userRepository.addCredits(transaction.userId, 'paid', plan.credits)
  }

  logger.success(`Payment confirmed: transaction ${transaction.id}, +${plan.credits} paid credits for user ${transaction.userId}`)

  logRepository.create({
    category: 'system',
    level: 'info',
    action: 'PAYMENT_CONFIRMED',
    title: 'Pagamento confirmado',
    description: `${transaction.planName} pago por ${transaction.userEmail}`,
    userId: transaction.userId,
    userEmail: transaction.userEmail,
    targetId: transaction.id,
    targetName: transaction.planName,
    details: { amount: transaction.amount, credits: plan.credits, extraStorageDays: plan.extraStorageDays ?? 0 }
  })
}

export default confirmPayment
