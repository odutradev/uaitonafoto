import { removeUndefined } from '@utils/object'
import CreditUsageModel from './model'

import type { CreateCreditUsagePayload, CreditUsageEntity } from './types'

const toCreditUsageEntity = (doc: any): CreditUsageEntity => {
  const { _id, ...rest } = doc
  return {
    ...rest,
    id: String(_id),
    amount: rest.amount ?? 1
  }
}

export const creditUsageRepository = {
  create: async (payload: CreateCreditUsagePayload): Promise<CreditUsageEntity> => {
    const created = await CreditUsageModel.create(
      removeUndefined({
        ...payload,
        createdAt: payload.createdAt ?? new Date().toISOString()
      })
    )
    return toCreditUsageEntity(created.toObject())
  },

  findByEventId: async (eventId: string): Promise<CreditUsageEntity | null> => {
    const doc = await CreditUsageModel.findOne({ eventId }).lean()
    return doc ? toCreditUsageEntity(doc) : null
  },

  listByUser: async (userId: string): Promise<CreditUsageEntity[]> => {
    const docs = await CreditUsageModel.find({ userId }).sort({ createdAt: -1 }).lean()
    return docs.map(toCreditUsageEntity)
  }
}

export default creditUsageRepository
