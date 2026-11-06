import mongoose, { Schema } from 'mongoose'
import type { TransactionEntity } from './types'

export type TransactionDocument = Omit<TransactionEntity, 'id'> & { _id: string }

const webhookEventSchema = new Schema(
  {
    deliveryId: { type: String },
    event: { type: String, required: true },
    devMode: { type: Boolean },
    receivedAt: { type: String, required: true },
    payload: { type: Schema.Types.Mixed }
  },
  { _id: false }
)

const transactionSchema = new Schema<TransactionDocument>(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    planId: { type: String, required: true, index: true },
    planType: { type: String, required: true },
    planName: { type: String, required: true },
    planSnapshot: { type: Schema.Types.Mixed, required: true },
    quantity: { type: Number, required: true, default: 1 },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'PAID', 'REFUNDED', 'DISPUTED', 'EXPIRED', 'CANCELLED'],
      default: 'PENDING',
      index: true
    },
    gateway: { type: String, required: true, default: 'abacatepay' },
    checkoutId: { type: String, index: true },
    checkoutUrl: { type: String },
    customerId: { type: String },
    methods: { type: [String], default: [] },
    paymentMethod: { type: String },
    paidAmount: { type: Number },
    platformFee: { type: Number },
    receiptUrl: { type: String },
    payerInformation: { type: Schema.Types.Mixed },
    devMode: { type: Boolean, default: false },
    returnUrl: { type: String },
    completionUrl: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    gatewayResponse: { type: Schema.Types.Mixed },
    webhookEvents: { type: [webhookEventSchema], default: [] },
    paidAt: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() }
  },
  {
    timestamps: false,
    versionKey: false
  }
)

export const TransactionModel = mongoose.models.Transaction || mongoose.model<TransactionDocument>('Transaction', transactionSchema)
export default TransactionModel
