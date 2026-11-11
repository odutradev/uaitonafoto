import subscriptionRepository from '@domains/payments/repositories/subscriptions'
import transactionRepository from '@domains/payments/repositories/transactions'
import purchaseRepository from '@domains/payments/repositories/purchases'
import computeNextBillingDate from './computeNextBillingDate'
import { getPaymentClient } from '@payment'
import createLogger from '@utils/logger'

import type { SubscriptionEntity } from '@domains/payments/repositories/subscriptions/types'
import type { TransactionEntity } from '@domains/payments/repositories/transactions/types'
import type { CachedPlan } from '@payment/plans/types'

const logger = createLogger('payments:subscription')

export interface GatewaySubscriptionInfo {
  id?: string
  frequency?: string
  method?: string
}

const fetchGatewaySubscription = async (transactionId: string): Promise<GatewaySubscriptionInfo> => {
  try {
    const client = await getPaymentClient()
    const response = await client.subscriptions.get({ externalId: transactionId })
    if (response.error || !response.data?.id) return {}
    return { id: response.data.id, method: response.data.method }
  } catch (error) {
    logger.warn(`Could not fetch subscription from gateway for transaction ${transactionId}:`, error)
    return {}
  }
}

export const ensureSubscriptionRecord = async (
  transaction: TransactionEntity,
  gatewayInfo?: GatewaySubscriptionInfo
): Promise<SubscriptionEntity | null> => {
  if (transaction.planType !== 'SUBSCRIPTION') return null

  const knownSubscriptionId = gatewayInfo?.id ?? transaction.subscriptionId
  const knownMethod = gatewayInfo?.method ?? transaction.paymentMethod
  const frequency = gatewayInfo?.frequency ?? 'MONTHLY'

  const fetchedSubscription = knownSubscriptionId ? {} : await fetchGatewaySubscription(transaction.id)
  const subscriptionId = knownSubscriptionId || fetchedSubscription.id
  const method = knownMethod ?? fetchedSubscription.method

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
