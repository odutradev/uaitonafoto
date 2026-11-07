import defineAction from '@factories/defineAction'
import purchaseRepository from '../../repositories/purchases'
import toPurchaseItemResponse from './utils/toPurchaseItemResponse'
import { purchaseListResponseSchema } from './schemas'

import type { ManageRequestResponse } from '@middlewares/manageRequest/types'
import type { PurchaseListResponse } from './types'

export const listMyPurchases = defineAction(
  {
    method: 'get',
    path: '/payments/purchases',
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
