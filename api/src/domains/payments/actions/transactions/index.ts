import syncOrExpirePendingTransactions from '@domains/payments/utils/syncOrExpirePendingTransactions'
import { buildPaginatedResponse, getPaginationOptions } from '@factories/pagination/utils'
import { listTransactionsQuerySchema, listTransactionsResponseSchema } from './schemas'
import transactionRepository from '@domains/payments/repositories/transactions'
import defineAction from '@factories/defineAction'

import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type { TransactionEntity } from '@domains/payments/repositories/transactions/types'
import type { ListTransactionsRequest, ListTransactionsResponse } from './types'
import type { TransactionItemResponse } from './types'

const normalizePlanName = (planId: string, planType: string, planName: string): string => {
  if (planId === 'free_trial' || planType === 'FREE' || planName === 'Modo Degustação') {
    return 'Teste Grátis'
  }
  return planName
}

const toTransactionItemResponse = (entity: TransactionEntity): TransactionItemResponse => ({
  id: entity.id,
  planId: entity.planId,
  planType: entity.planType,
  planName: normalizePlanName(entity.planId, entity.planType, entity.planName),
  amount: entity.amount,
  paidAmount: entity.paidAmount,
  currency: entity.currency,
  status: entity.status,
  cancelReason: entity.cancelReason,
  paymentMethod: entity.paymentMethod,
  checkoutUrl: entity.status === 'PENDING' ? entity.checkoutUrl : undefined,
  receiptUrl: entity.receiptUrl,
  subscriptionId: entity.subscriptionId,
  paidAt: entity.paidAt,
  createdAt: entity.createdAt
})

export const listMyTransactions = defineAction(
  {
    method: 'get',
    path: '/payments/transactions/list',
    summary: 'Listar histórico paginado de faturas e transações do usuário autenticado',
    tags: ['Pagamentos'],
    authenticate: true,
    schema: {
      query: listTransactionsQuerySchema
    },
    responses: {
      200: { description: 'Histórico paginado de transações', schema: listTransactionsResponseSchema }
    }
  },
  async ({ ids, query, manageError }: ManageRequestBody<ListTransactionsRequest>): ManageRequestResponse<ListTransactionsResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    await syncOrExpirePendingTransactions({ userId: ids.userId, checkGateway: true })

    const { page, limit, offset } = getPaginationOptions(query)

    const result = await transactionRepository.listPaginatedByUser({
      userId: ids.userId,
      limit,
      offset,
      status: query?.status,
      planType: query?.planType
    })

    return buildPaginatedResponse(
      {
        count: result.count,
        rows: result.rows.map(toTransactionItemResponse)
      },
      page,
      limit
    )
  }
)
