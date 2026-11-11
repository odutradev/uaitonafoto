import mongoose, { Schema } from 'mongoose'

import type { CreditUsageEntity } from './types'

export type CreditUsageDocument = Omit<CreditUsageEntity, 'id'> & { _id: string }

const creditUsageSchema = new Schema<CreditUsageDocument>(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    userId: { type: String, required: true, index: true },
    eventId: { type: String, required: true, index: true },
    eventName: { type: String, required: true },
    creditType: { type: String, enum: ['free', 'paid'], required: true },
    amount: { type: Number, required: true, default: 1 },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  {
    timestamps: false,
    versionKey: false
  }
)

const CreditUsageModel =
  (mongoose.models.CreditUsage as mongoose.Model<CreditUsageDocument>) ||
  mongoose.model<CreditUsageDocument>('CreditUsage', creditUsageSchema, 'credit_usages')

export default CreditUsageModel
