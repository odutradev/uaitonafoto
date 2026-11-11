import { removeUndefined } from '@utils/object'
import TransactionModel from './model'

import type { CreateCancelledTransactionPayload, CreatePaidTransactionPayload, CreateTransactionPayload, ListUserTransactionsPaginatedParams, TransactionEntity, TransactionStatus, TransactionWebhookEvent, UpdateTransactionPayload } from './types'
import type { PaginatedData } from '@factories/pagination/types'

const toTransactionEntity = (doc: any): TransactionEntity => {
  const { _id, effectiveDate: _effectiveDate, ...rest } = doc
  return { ...rest, id: String(_id), webhookEvents: rest.webhookEvents ?? [] }
}

export const transactionRepository = {
  create: async (payload: CreateTransactionPayload): Promise<TransactionEntity> => {
    const created = await TransactionModel.create(removeUndefined(payload))
    return toTransactionEntity(created.toObject())
  },

  createPaid: async (payload: CreatePaidTransactionPayload): Promise<TransactionEntity> => {
    const created = await TransactionModel.create(removeUndefined({ ...payload, status: 'PAID' as const }))
    return toTransactionEntity(created.toObject())
  },

  createCancelled: async (payload: CreateCancelledTransactionPayload): Promise<TransactionEntity> => {
    const created = await TransactionModel.create(
      removeUndefined({ ...payload, status: 'CANCELLED' as const, webhookEvents: [] })
    )
    return toTransactionEntity(created.toObject())
  },

  findById: async (id: string): Promise<TransactionEntity | null> => {
    const doc = await TransactionModel.findById(id).lean()
    return doc ? toTransactionEntity(doc) : null
  },

  findByCheckoutId: async (checkoutId: string): Promise<TransactionEntity | null> => {
    const doc = await TransactionModel.findOne({ checkoutId }).lean()
    return doc ? toTransactionEntity(doc) : null
  },

  findBySubscriptionId: async (subscriptionId: string): Promise<TransactionEntity | null> => {
    const doc = await TransactionModel.findOne({ subscriptionId }).sort({ createdAt: 1 }).lean()
    return doc ? toTransactionEntity(doc) : null
  },

  findByExternalPaymentId: async (externalPaymentId: string): Promise<TransactionEntity | null> => {
    const doc = await TransactionModel.findOne({ externalPaymentId }).lean()
    return doc ? toTransactionEntity(doc) : null
  },

  listSubscriptionTransactionsToSync: async (): Promise<TransactionEntity[]> => {
    const docs = await TransactionModel.find({
      planType: 'SUBSCRIPTION',
      $or: [
        { status: 'PAID', subscriptionId: { $exists: false } },
        { status: 'PENDING' }
      ]
    }).lean()
    return docs.map(toTransactionEntity)
  },

  listByUser: async (userId: string): Promise<TransactionEntity[]> => {
    const docs = await TransactionModel.find({ userId }).sort({ createdAt: -1 }).lean()
    return docs.map(toTransactionEntity)
  },

  listPaginatedByUser: async ({
    userId,
    limit,
    offset,
    status,
    planType
  }: ListUserTransactionsPaginatedParams): Promise<PaginatedData<TransactionEntity>> => {
    const filter = removeUndefined({
      userId,
      status,
      planType
    })

    const [count, docs] = await Promise.all([
      TransactionModel.countDocuments(filter),
      TransactionModel.aggregate([
        { $match: filter },
        { $addFields: { effectiveDate: { $ifNull: ['$paidAt', '$createdAt'] } } },
        { $sort: { effectiveDate: -1, _id: -1 } },
        { $skip: offset },
        { $limit: limit }
      ])
    ])

    return {
      count,
      rows: docs.map(toTransactionEntity)
    }
  },

  update: async (id: string, data: UpdateTransactionPayload): Promise<TransactionEntity | null> => {
    const updateData = removeUndefined({ ...data, updatedAt: new Date().toISOString() })
    const doc = await TransactionModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, lean: true })
    return doc ? toTransactionEntity(doc) : null
  },

  appendWebhookEvent: async (id: string, event: TransactionWebhookEvent): Promise<void> => {
    await TransactionModel.findByIdAndUpdate(id, {
      $push: { webhookEvents: event },
      $set: { updatedAt: new Date().toISOString() }
    })
  },

  transitionStatus: async (
    id: string,
    fromStatuses: TransactionStatus[],
    data: UpdateTransactionPayload & { status: TransactionStatus }
  ): Promise<TransactionEntity | null> => {
    const updateData = removeUndefined({ ...data, updatedAt: new Date().toISOString() })
    const doc = await TransactionModel.findOneAndUpdate(
      { _id: id, status: { $in: fromStatuses } },
      { $set: updateData },
      { new: true, lean: true }
    )
    return doc ? toTransactionEntity(doc) : null
  },

  listPending: async (userId?: string): Promise<TransactionEntity[]> => {
    const filter: Record<string, unknown> = { status: 'PENDING' }
    if (userId) filter.userId = userId
    const docs = await TransactionModel.find(filter).sort({ createdAt: -1 }).lean()
    return docs.map(toTransactionEntity)
  },

  expirePendingOlderThan: async (cutoffIsoDate: string, userId?: string): Promise<number> => {
    const filter: Record<string, unknown> = {
      status: 'PENDING',
      createdAt: { $lte: cutoffIsoDate }
    }
    if (userId) filter.userId = userId

    const result = await TransactionModel.updateMany(filter, {
      $set: {
        status: 'EXPIRED' as const,
        cancelReason: 'checkout_expired',
        updatedAt: new Date().toISOString()
      }
    })

    return result.modifiedCount ?? 0
  }
}

export default transactionRepository
