import purchaseRepository from '@domains/payments/repositories/purchases'
import { purchaseListResponseSchema } from './schemas'
import defineAction from '@factories/defineAction'

import type { PurchaseEntity } from '@domains/payments/repositories/purchases/types'
import type { ManageRequestResponse } from '@middlewares/manageRequest/types'
import type { PurchaseItemResponse, PurchaseListResponse } from './types'

const normalizePlanName = (planId: string, planType: string, planName: string): string => {
  if (planId === 'free_trial' || planType === 'FREE' || planName === 'Modo Degustação') {
    return 'Teste Grátis'
  }
  return planName
}

const toPurchaseItemResponse = (entity: PurchaseEntity): PurchaseItemResponse => ({
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

export const listMyPurchases = defineAction(
  {
    method: 'get',
    path: '/payments/purchases/list',
    summary: 'Listar lotes de créditos e aquisições do usuário autenticado',
    tags: ['Pagamentos'],
    authenticate: true,
    responses: {
      200: { description: 'Lista de lotes de créditos adquiridos', schema: purchaseListResponseSchema }
    }
  },
  async ({ ids, manageError }): ManageRequestResponse<PurchaseListResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const purchases = await purchaseRepository.listByUser(ids.userId)
    return purchases.map(toPurchaseItemResponse)
  }
)
