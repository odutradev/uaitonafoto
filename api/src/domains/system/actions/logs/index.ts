import defineAction from '@factories/defineAction'
import { buildPaginatedResponse, getPaginationOptions } from '@factories/pagination/utils'
import userRepository from '@domains/users/repositories'
import logRepository from '../../repositories'
import toLogItemResponse from './utils/toLogItemResponse'
import { listLogsQuerySchema, listLogsResponseSchema } from './schemas'

import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type { ListLogsRequest, ListLogsResponse } from './types'

export const listLogs = defineAction(
  {
    method: 'get',
    path: '/logs',
    summary: 'Listar histórico paginado de logs de atividades (próprios ou globais para admin)',
    tags: ['Sistema'],
    authenticate: true,
    schema: {
      query: listLogsQuerySchema
    },
    responses: {
      200: { description: 'Lista paginada de logs', schema: listLogsResponseSchema }
    }
  },
  async ({ ids, query, manageError }: ManageRequestBody<ListLogsRequest>): ManageRequestResponse<ListLogsResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const user = await userRepository.findById(ids.userId)
    if (!user) return manageError({ code: 'user_not_found' })

    const isAdmin = user.role === 'admin'
    const effectiveUserId = isAdmin && query?.scope !== 'me' ? undefined : user.id
    const { page, limit, offset } = getPaginationOptions(query)

    const result = await logRepository.listPaginated({
      limit,
      offset,
      userId: effectiveUserId,
      category: query?.category,
      level: query?.level,
      action: query?.action,
      search: query?.search
    })

    return buildPaginatedResponse(
      {
        count: result.count,
        rows: result.rows.map((entry) => toLogItemResponse(entry, isAdmin))
      },
      page,
      limit
    )
  }
)
