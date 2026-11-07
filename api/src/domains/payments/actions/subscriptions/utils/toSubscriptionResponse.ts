import type { SubscriptionEntity } from '../../../repositories/subscriptions/types'
import type { SubscriptionResponse } from '../types'

export const toSubscriptionResponse = (entity: SubscriptionEntity): SubscriptionResponse => ({
  id: entity.id,
  subscriptionId: entity.subscriptionId,
  planId: entity.planId,
  planName: entity.planName,
  amount: entity.amount,
  currency: entity.currency,
  creditsPerCycle: entity.creditsPerCycle,
  frequency: entity.frequency,
  method: entity.method,
  status: entity.status,
  cyclesCompleted: entity.cyclesCompleted,
  lastPaidAt: entity.lastPaidAt,
  nextBillingAt: entity.nextBillingAt,
  cancelledAt: entity.cancelledAt,
  createdAt: entity.createdAt
})

export default toSubscriptionResponse
