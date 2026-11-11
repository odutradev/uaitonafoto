import creditUsageRepository from '@domains/payments/repositories/creditUsages'
import eventRepository from '@domains/events/repositories/events'
import { creditUsageListResponseSchema } from './schemas'
import defineAction from '@factories/defineAction'

import type { CreditUsageEntity } from '@domains/payments/repositories/creditUsages/types'
import type { CreditUsageItemResponse, CreditUsageListResponse } from './types'
import type { ManageRequestResponse } from '@middlewares/manageRequest/types'

const toCreditUsageResponse = (entity: CreditUsageEntity): CreditUsageItemResponse => ({
  id: entity.id,
  userId: entity.userId,
  eventId: entity.eventId,
  eventName: entity.eventName,
  creditType: entity.creditType,
  amount: entity.amount,
  createdAt: entity.createdAt
})

export const listMyCreditUsages = defineAction(
  {
    method: 'get',
    path: '/payments/credit-usages/list',
    summary: 'Listar histórico de créditos utilizados pelo usuário autenticado',
    tags: ['Pagamentos'],
    authenticate: true,
    responses: {
      200: { description: 'Lista de créditos utilizados', schema: creditUsageListResponseSchema }
    }
  },
  async ({ ids, manageError }): ManageRequestResponse<CreditUsageListResponse> => {
    const userId = ids.userId
    if (!userId) return manageError({ code: 'unauthorized' })

    const existingUsages = await creditUsageRepository.listByUser(userId)
    const existingEventIds = new Set(existingUsages.map((u) => u.eventId))

    const createdEvents = await eventRepository.listAllByCreator(userId)
    const missingEvents = createdEvents.filter((ev) => !existingEventIds.has(ev.id))

    if (missingEvents.length > 0) {
      await Promise.all(
        missingEvents.map((ev) =>
          creditUsageRepository.create({
            userId,
            eventId: ev.id,
            eventName: ev.name,
            creditType: ev.creditType ?? 'paid',
            amount: 1,
            createdAt: ev.createdAt
          })
        )
      )

      const reloadedUsages = await creditUsageRepository.listByUser(userId)
      return reloadedUsages.map(toCreditUsageResponse)
    }

    return existingUsages.map(toCreditUsageResponse)
  }
)
