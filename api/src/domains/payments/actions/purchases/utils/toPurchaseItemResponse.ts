import type { PurchaseEntity } from '../../../repositories/purchases/types'
import type { PurchaseItemResponse } from '../types'

export const toPurchaseItemResponse = (entity: PurchaseEntity): PurchaseItemResponse => ({
  id: entity.id,
  transactionId: entity.transactionId,
  subscriptionId: entity.subscriptionId,
  planId: entity.planId,
  planType: entity.planType,
  planName: entity.planName,
  amount: entity.amount,
  currency: entity.currency,
  credits: entity.credits,
  remainingCredits: entity.remainingCredits,
  expiredCredits: entity.expiredCredits,
  creditsExpiresAt: entity.creditsExpiresAt,
  creditsExpiredAt: entity.creditsExpiredAt,
  creditType: entity.creditType,
  extraStorageDays: entity.extraStorageDays,
  createdAt: entity.createdAt
})

export default toPurchaseItemResponse
