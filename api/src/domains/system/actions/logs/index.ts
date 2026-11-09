import defineAction from '@factories/defineAction'
import { buildPaginatedResponse, getPaginationOptions } from '@factories/pagination/utils'
import userRepository from '@domains/users/repositories'
import logRepository from '../../repositories'
import type { LogEntity } from '../../repositories/types'
import type { LogItemResponse } from './types'
import { listLogsQuerySchema, listLogsResponseSchema } from './schemas'

const replaceLegacyFreeTrialLabel = (text?: string): string | undefined =>
  text ? text.replace(/Modo Degustação/gi, 'Teste Grátis') : text

const toLogItemResponse = (entity: LogEntity, isAdmin: boolean): LogItemResponse => ({
  id: entity.id,
  category: entity.category,
  level: entity.level,
  action: entity.action,
  title: replaceLegacyFreeTrialLabel(entity.title) ?? entity.title,
  description: replaceLegacyFreeTrialLabel(entity.description) ?? entity.description,
  userId: entity.userId,
  userName: entity.userName,
  userEmail: entity.userEmail,
  targetId: entity.targetId,
  targetName: entity.targetName,
  details: entity.details,
  errorMessage: isAdmin ? entity.errorMessage : undefined,
  ipAddress: isAdmin ? entity.ipAddress : undefined,
  createdAt: entity.createdAt
})

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
