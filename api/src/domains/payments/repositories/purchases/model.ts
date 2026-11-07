import mongoose, { Schema } from 'mongoose'
import type { PurchaseEntity } from './types'

export type PurchaseDocument = Omit<PurchaseEntity, 'id'> & { _id: string }

const purchaseSchema = new Schema<PurchaseDocument>(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    userId: { type: String, required: true, index: true },
    transactionId: { type: String, required: true, unique: true },
    subscriptionId: { type: String, index: true },
    planId: { type: String, required: true },
    planType: { type: String, required: true },
    planName: { type: String, required: true },
    abacateProductId: { type: String, required: true },
    planSnapshot: { type: Schema.Types.Mixed, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    credits: { type: Number, required: true, default: 0 },
    remainingCredits: { type: Number, required: true, default: 0, min: 0 },
    expiredCredits: { type: Number, required: true, default: 0, min: 0 },
    creditsExpiresAt: { type: String, index: true },
    creditsExpiredAt: { type: String },
    creditType: { type: String, enum: ['free', 'paid'], required: true, default: 'paid' },
    extraStorageDays: { type: Number, required: true, default: 0 },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  {
    timestamps: false,
    versionKey: false
  }
)

export const PurchaseModel = mongoose.models.Purchase || mongoose.model<PurchaseDocument>('Purchase', purchaseSchema)
export default PurchaseModel
