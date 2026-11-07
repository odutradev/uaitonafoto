import { getPaymentClient } from '@payment'
import createLogger from '@utils/logger'
import transactionRepository from '../repositories/transactions'
import purchaseRepository from '../repositories/purchases'
import subscriptionRepository from '../repositories/subscriptions'
import computeNextBillingDate from './computeNextBillingDate'

import type { CachedPlan } from '@payment/plans/types'
import type { TransactionEntity } from '../repositories/transactions/types'
import type { SubscriptionEntity } from '../repositories/subscriptions/types'

const logger = createLogger('payments:subscription')

export interface GatewaySubscriptionInfo {
  id?: string
  frequency?: string
  method?: string
}

export const ensureSubscriptionRecord = async (
  transaction: TransactionEntity,
  gatewayInfo?: GatewaySubscriptionInfo
): Promise<SubscriptionEntity | null> => {
  if (transaction.planType !== 'SUBSCRIPTION') return null

  let subscriptionId = gatewayInfo?.id ?? transaction.subscriptionId
  let method = gatewayInfo?.method ?? transaction.paymentMethod
  const frequency = gatewayInfo?.frequency ?? 'MONTHLY'

  if (!subscriptionId) {
    try {
      const client = await getPaymentClient()
      const response = await client.subscriptions.get({ externalId: transaction.id })
      if (!response.error && response.data?.id) {
        subscriptionId = response.data.id
        method = method ?? response.data.method
      }
    } catch (error) {
      logger.warn(`Could not fetch subscription from gateway for transaction ${transaction.id}:`, error)
    }
  }

  if (!subscriptionId) return null

  if (transaction.subscriptionId !== subscriptionId) {
    await Promise.all([
      transactionRepository.update(transaction.id, { subscriptionId }),
      purchaseRepository.attachSubscriptionId(transaction.id, subscriptionId)
    ])
  }

  const plan = transaction.planSnapshot as CachedPlan
  const lastPaidAt = transaction.paidAt ?? new Date().toISOString()

  return subscriptionRepository.upsertFromInitial({
    subscriptionId,
    userId: transaction.userId,
    initialTransactionId: transaction.id,
    checkoutId: transaction.checkoutId,
    customerId: transaction.customerId,
    planId: transaction.planId,
    planName: transaction.planName,
    abacateProductId: plan.abacateProductId,
    planSnapshot: plan,
    amount: transaction.amount,
    currency: transaction.currency,
    creditsPerCycle: plan.credits,
    frequency,
    method,
    lastPaidAt,
    nextBillingAt: computeNextBillingDate(lastPaidAt, frequency),
    devMode: transaction.devMode
  })
}

export default ensureSubscriptionRecord
