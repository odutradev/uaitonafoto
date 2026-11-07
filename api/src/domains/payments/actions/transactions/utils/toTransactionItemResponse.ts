import type { TransactionEntity } from '../../../repositories/transactions/types'
import type { TransactionItemResponse } from '../types'

export const toTransactionItemResponse = (entity: TransactionEntity): TransactionItemResponse => ({
  id: entity.id,
  planId: entity.planId,
  planType: entity.planType,
  planName: entity.planName,
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
