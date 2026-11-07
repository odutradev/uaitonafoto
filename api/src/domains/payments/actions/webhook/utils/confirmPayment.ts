import createLogger from '@utils/logger'
import userRepository from '@domains/users/repositories'
import logRepository from '@domains/system/repositories'
import transactionRepository from '../../../repositories/transactions'
import purchaseRepository from '../../../repositories/purchases'
import ensureSubscriptionRecord from '../../../utils/ensureSubscriptionRecord'

import type { CachedPlan } from '@payment/plans/types'
import type { TransactionEntity } from '../../../repositories/transactions/types'
import type { WebhookEventData } from '../types'

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

  let current = claimed ?? (await transactionRepository.findById(transaction.id))
  if (current?.status !== 'PAID') return

  if (!claimed && payment?.id && !current.externalPaymentId) {
    current = (await transactionRepository.update(current.id, { externalPaymentId: payment.id })) ?? current
  }

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
