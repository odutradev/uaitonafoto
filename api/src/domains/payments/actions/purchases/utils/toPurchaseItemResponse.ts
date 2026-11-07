import type { PurchaseEntity } from '../../../repositories/purchases/types'
import type { PurchaseItemResponse } from '../types'

const normalizePlanName = (planId: string, planType: string, planName: string): string => {
  if (planId === 'free_trial' || planType === 'FREE' || planName === 'Modo Degustação') {
    return 'Teste Grátis'
  }
  return planName
}

export const toPurchaseItemResponse = (entity: PurchaseEntity): PurchaseItemResponse => ({
  id: entity.id,
  transactionId: entity.transactionId,
  subscriptionId: entity.subscriptionId,
  planId: entity.planId,
  planType: entity.planType,
  planName: normalizePlanName(entity.planId, entity.planType, entity.planName),
  amount: entity.amount,
  currency: entity.currency,
  credits: entity.credits,
  remainingCredits: entity.remainingCredits,
  creditType: entity.creditType,
  extraStorageDays: entity.extraStorageDays,
  createdAt: entity.createdAt
})

export default toPurchaseItemResponse
