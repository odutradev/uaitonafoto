import { removeUndefined } from '@utils/object'
import TransactionModel from './model'
import type { CreateTransactionPayload, TransactionEntity, TransactionStatus, TransactionWebhookEvent, UpdateTransactionPayload } from './types'

const toTransactionEntity = (doc: any): TransactionEntity => {
  const { _id, ...rest } = doc
  return { ...rest, id: String(_id), webhookEvents: rest.webhookEvents ?? [] }
}

export const transactionRepository = {
  create: async (payload: CreateTransactionPayload): Promise<TransactionEntity> => {
    const created = await TransactionModel.create(removeUndefined(payload))
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

  listByUser: async (userId: string): Promise<TransactionEntity[]> => {
    const docs = await TransactionModel.find({ userId }).sort({ createdAt: -1 }).lean()
    return docs.map(toTransactionEntity)
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
  }
}

export default transactionRepository
