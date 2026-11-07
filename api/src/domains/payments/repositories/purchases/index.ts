import { removeUndefined } from '@utils/object'
import PurchaseModel from './model'
import type { CreatePurchasePayload, PurchaseEntity } from './types'

const toPurchaseEntity = (doc: any): PurchaseEntity => {
  const { _id, ...rest } = doc
  return { ...rest, id: String(_id) }
}

export const purchaseRepository = {
  create: async (payload: CreatePurchasePayload): Promise<PurchaseEntity> => {
    const created = await PurchaseModel.create(removeUndefined(payload))
    return toPurchaseEntity(created.toObject())
  },

  findByTransactionId: async (transactionId: string): Promise<PurchaseEntity | null> => {
    const doc = await PurchaseModel.findOne({ transactionId }).lean()
    return doc ? toPurchaseEntity(doc) : null
  },

  attachSubscriptionId: async (transactionId: string, subscriptionId: string): Promise<void> => {
    await PurchaseModel.updateOne({ transactionId }, { $set: { subscriptionId } })
  },

  listByUser: async (userId: string): Promise<PurchaseEntity[]> => {
    const docs = await PurchaseModel.find({ userId }).sort({ createdAt: -1 }).lean()
    return docs.map(toPurchaseEntity)
  }
}

export default purchaseRepository
