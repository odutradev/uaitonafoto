import type { CreditUsageEntity } from '../../../repositories/creditUsages/types'
import type { CreditUsageItemResponse } from '../types'

export const toCreditUsageResponse = (entity: CreditUsageEntity): CreditUsageItemResponse => ({
  id: entity.id,
  userId: entity.userId,
  eventId: entity.eventId,
  eventName: entity.eventName,
  creditType: entity.creditType,
  amount: entity.amount,
  createdAt: entity.createdAt
})

export default toCreditUsageResponse
