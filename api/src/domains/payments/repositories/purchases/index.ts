import { removeUndefined } from '@utils/object'
import PurchaseModel from './model'

import type { CreditType } from '@domains/users/repositories/users/types'
import type { CreatePurchasePayload, PurchaseEntity } from './types'
import type { PurchaseDocument } from './model'

const toPurchaseEntity = (doc: PurchaseDocument): PurchaseEntity => {
  const { _id, ...rest } = doc
  const credits = rest.credits ?? 0
  return {
    ...rest,
    id: String(_id),
    credits,
    remainingCredits: rest.remainingCredits ?? credits,
    expiredCredits: rest.expiredCredits ?? 0
  }
}

export const purchaseRepository = {
  create: async (payload: CreatePurchasePayload): Promise<PurchaseEntity> => {
    const remainingCredits = payload.remainingCredits ?? payload.credits
    const created = await PurchaseModel.create(removeUndefined({ ...payload, remainingCredits }))
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
  },

  listActiveBySubscription: async (subscriptionId: string): Promise<PurchaseEntity[]> => {
    const docs = await PurchaseModel.find({
      subscriptionId,
      planType: 'SUBSCRIPTION',
      remainingCredits: { $gt: 0 }
    })
      .sort({ createdAt: 1 })
      .lean()

    return docs.map(toPurchaseEntity)
  },

  listExpiredSubscriptionPurchases: async (nowIso: string): Promise<PurchaseEntity[]> => {
    const docs = await PurchaseModel.find({
      planType: 'SUBSCRIPTION',
      remainingCredits: { $gt: 0 },
      creditsExpiresAt: { $lte: nowIso }
    }).lean()

    return docs.map(toPurchaseEntity)
  },

  updateCreditsExpiration: async (id: string, creditsExpiresAt: string): Promise<void> => {
    await PurchaseModel.updateOne({ _id: id }, { $set: { creditsExpiresAt } })
  },

  expirePurchaseCredits: async (id: string, nowIso: string): Promise<number> => {
    const previous = await PurchaseModel.findOneAndUpdate(
      { _id: id, remainingCredits: { $gt: 0 } },
      [
        {
          $set: {
            expiredCredits: { $add: [{ $ifNull: ['$expiredCredits', 0] }, '$remainingCredits'] },
            remainingCredits: 0,
            creditsExpiredAt: nowIso
          }
        }
      ],
      { new: false, lean: true, updatePipeline: true }
    )

    return previous?.remainingCredits ?? 0
  },

  consumeCredit: async (userId: string, creditType: CreditType): Promise<PurchaseEntity | null> => {
    const purchase = await PurchaseModel.findOneAndUpdate(
      { userId, creditType, remainingCredits: { $gt: 0 } },
      { $inc: { remainingCredits: -1 } },
      { sort: { createdAt: 1 }, new: true, lean: true }
    )

    return purchase ? toPurchaseEntity(purchase) : null
  }
}

export default purchaseRepository
