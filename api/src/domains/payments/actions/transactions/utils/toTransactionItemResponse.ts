import type { TransactionEntity } from '../../../repositories/transactions/types'
import type { TransactionItemResponse } from '../types'

const normalizePlanName = (planId: string, planType: string, planName: string): string => {
  if (planId === 'free_trial' || planType === 'FREE' || planName === 'Modo Degustação') {
    return 'Teste Grátis'
  }
  return planName
}

export const toTransactionItemResponse = (entity: TransactionEntity): TransactionItemResponse => ({
  id: entity.id,
  planId: entity.planId,
  planType: entity.planType,
  planName: normalizePlanName(entity.planId, entity.planType, entity.planName),
  amount: entity.amount,
  paidAmount: entity.paidAmount,
  currency: entity.currency,
  status: entity.status,
  paymentMethod: entity.paymentMethod,
  checkoutUrl: entity.status === 'PENDING' ? entity.checkoutUrl : undefined,
  receiptUrl: entity.receiptUrl,
  subscriptionId: entity.subscriptionId,
  paidAt: entity.paidAt,
  createdAt: entity.createdAt
})

export default toTransactionItemResponse
