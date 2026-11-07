import { removeUndefined } from '@utils/object'
import SubscriptionModel from './model'
import type {
  RecordRenewalPayload,
  SubscriptionEntity,
  UpdateSubscriptionStatusPayload,
  UpsertSubscriptionPayload
} from './types'

const toSubscriptionEntity = (doc: any): SubscriptionEntity => {
  const { _id, ...rest } = doc
  return { ...rest, id: String(_id) }
}

export const subscriptionRepository = {
  upsertFromInitial: async (payload: UpsertSubscriptionPayload): Promise<SubscriptionEntity> => {
    const now = new Date().toISOString()
    const {
      subscriptionId,
      initialTransactionId,
      frequency = 'MONTHLY',
      status = 'ACTIVE',
      ...rest
    } = payload

    const updateFields = removeUndefined({
      subscriptionId,
      frequency,
      method: rest.method,
      checkoutId: rest.checkoutId,
      customerId: rest.customerId,
      nextBillingAt: rest.nextBillingAt,
      updatedAt: now
    })

    const doc = await SubscriptionModel.findOneAndUpdate(
      { initialTransactionId },
      {
        $set: updateFields,
        $setOnInsert: {
          _id: new SubscriptionModel()._id,
          initialTransactionId,
          userId: rest.userId,
          planId: rest.planId,
          planName: rest.planName,
          abacateProductId: rest.abacateProductId,
          planSnapshot: rest.planSnapshot,
          amount: rest.amount,
          currency: rest.currency,
          creditsPerCycle: rest.creditsPerCycle,
          status,
          cyclesCompleted: 1,
          lastPaidAt: rest.lastPaidAt,
          devMode: rest.devMode,
          createdAt: now
        }
      },
      { new: true, upsert: true, lean: true }
    )

    return toSubscriptionEntity(doc)
  },

  findById: async (id: string): Promise<SubscriptionEntity | null> => {
    const doc = await SubscriptionModel.findById(id).lean()
    return doc ? toSubscriptionEntity(doc) : null
  },

  findBySubscriptionId: async (subscriptionId: string): Promise<SubscriptionEntity | null> => {
    const doc = await SubscriptionModel.findOne({ subscriptionId }).lean()
    return doc ? toSubscriptionEntity(doc) : null
  },

  findByInitialTransactionId: async (initialTransactionId: string): Promise<SubscriptionEntity | null> => {
    const doc = await SubscriptionModel.findOne({ initialTransactionId }).lean()
    return doc ? toSubscriptionEntity(doc) : null
  },

  listByUser: async (userId: string): Promise<SubscriptionEntity[]> => {
    const docs = await SubscriptionModel.find({ userId }).sort({ createdAt: -1 }).lean()
    return docs.map(toSubscriptionEntity)
  },

  listActiveOrPastDue: async (): Promise<SubscriptionEntity[]> => {
    const docs = await SubscriptionModel.find({ status: { $in: ['ACTIVE', 'PAST_DUE'] } }).lean()
    return docs.map(toSubscriptionEntity)
  },

  recordRenewal: async (id: string, payload: RecordRenewalPayload): Promise<SubscriptionEntity | null> => {
    const updateData = removeUndefined({
      status: 'ACTIVE' as const,
      lastPaidAt: payload.lastPaidAt,
      nextBillingAt: payload.nextBillingAt,
      method: payload.method,
      updatedAt: new Date().toISOString()
    })

    const doc = await SubscriptionModel.findByIdAndUpdate(
      id,
      {
        $inc: { cyclesCompleted: 1 },
        $set: updateData
      },
      { new: true, lean: true }
    )

    return doc ? toSubscriptionEntity(doc) : null
  },

  updateStatus: async (id: string, payload: UpdateSubscriptionStatusPayload): Promise<SubscriptionEntity | null> => {
    const updateData = removeUndefined({
      ...payload,
      updatedAt: new Date().toISOString()
    })

    const doc = await SubscriptionModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, lean: true })
    return doc ? toSubscriptionEntity(doc) : null
  }
}

export default subscriptionRepository
