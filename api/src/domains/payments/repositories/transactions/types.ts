export type TransactionStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'DISPUTED' | 'EXPIRED' | 'CANCELLED'

export interface TransactionWebhookEvent {
  deliveryId?: string
  event: string
  devMode?: boolean
  receivedAt: string
  payload: unknown
}

export interface TransactionEntity {
  id: string
  userId: string
  userEmail: string
  userName: string
  planId: string
  planType: string
  planName: string
  planSnapshot: unknown
  quantity: number
  amount: number
  currency: string
  status: TransactionStatus
  cancelReason?: string
  gateway: string
  checkoutId?: string
  checkoutUrl?: string
  customerId?: string
  subscriptionId?: string
  externalPaymentId?: string
  methods: string[]
  paymentMethod?: string
  paidAmount?: number
  platformFee?: number
  receiptUrl?: string
  payerInformation?: unknown
  devMode: boolean
  returnUrl?: string
  completionUrl?: string
  ipAddress?: string
  userAgent?: string
  gatewayResponse?: unknown
  webhookEvents: TransactionWebhookEvent[]
  paidAt?: string
  createdAt: string
  updatedAt: string
}

export type CreateTransactionPayload = Omit<TransactionEntity, 'id' | 'status' | 'webhookEvents' | 'createdAt' | 'updatedAt'> & {
  status?: TransactionStatus
}

export type CreatePaidTransactionPayload = Omit<TransactionEntity, 'id' | 'status' | 'createdAt' | 'updatedAt'>

export type CreateCancelledTransactionPayload = Omit<TransactionEntity, 'id' | 'status' | 'webhookEvents' | 'createdAt' | 'updatedAt'> & {
  cancelReason: string
}

export type UpdateTransactionPayload = Partial<Omit<TransactionEntity, 'id' | 'webhookEvents' | 'createdAt' | 'updatedAt'>>

export interface ListUserTransactionsPaginatedParams {
  userId: string
  limit: number
  offset: number
  status?: TransactionStatus
  planType?: string
}
