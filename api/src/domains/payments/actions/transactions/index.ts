import defineAction from '@factories/defineAction'
import { buildPaginatedResponse, getPaginationOptions } from '@factories/pagination/utils'
import transactionRepository from '../../repositories/transactions'
import toTransactionItemResponse from './utils/toTransactionItemResponse'
import { listTransactionsQuerySchema, listTransactionsResponseSchema } from './schemas'

import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type { ListTransactionsRequest, ListTransactionsResponse } from './types'

export const listMyTransactions = defineAction(
  {
    method: 'get',
    path: '/payments/transactions',
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
