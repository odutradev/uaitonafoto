import mongoose, { Schema } from 'mongoose'

import type { SubscriptionEntity } from './types'

export type SubscriptionDocument = Omit<SubscriptionEntity, 'id'> & { _id: string }

const subscriptionSchema = new Schema<SubscriptionDocument>(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    subscriptionId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    initialTransactionId: { type: String, required: true, unique: true },
    checkoutId: { type: String, index: true },
    customerId: { type: String },
    planId: { type: String, required: true },
    planName: { type: String, required: true },
    abacateProductId: { type: String, required: true },
    planSnapshot: { type: Schema.Types.Mixed, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'BRL' },
    creditsPerCycle: { type: Number, required: true, default: 0 },
    frequency: { type: String, required: true, default: 'MONTHLY' },
    method: { type: String },
    status: {
      type: String,
      enum: ['ACTIVE', 'PAST_DUE', 'CANCELLED'],
      default: 'ACTIVE',
      index: true
    },
    cyclesCompleted: { type: Number, required: true, default: 1, min: 1 },
    lastPaidAt: { type: String, required: true },
    nextBillingAt: { type: String },
    renewalReminderSentFor: { type: String },
    cancelledAt: { type: String },
    cancelReason: { type: String },
    devMode: { type: Boolean, default: false },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() }
  },
  {
    timestamps: false,
    versionKey: false
  }
)

export const SubscriptionModel =
  mongoose.models.Subscription || mongoose.model<SubscriptionDocument>('Subscription', subscriptionSchema)

export default SubscriptionModel
