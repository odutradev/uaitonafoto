import type { z } from 'zod'
import type { webhookBodySchema, webhookResponseSchema } from './schemas'

export type WebhookRequest = { body: z.infer<typeof webhookBodySchema> }

export type WebhookResponse = z.infer<typeof webhookResponseSchema>

export interface WebhookCheckoutData {
  id?: string
  externalId?: string | null
  paidAmount?: number | null
  platformFee?: number | null
  receiptUrl?: string | null
  payerInformation?: unknown
}

export interface WebhookSubscriptionData {
  id: string
  amount?: number
  currency?: string
  method?: string
  status?: 'PENDING' | 'ACTIVE' | 'CANCELLED'
  frequency?: string
  canceledAt?: string | null
  cancelledDueTo?: string | null
}

export interface WebhookPaymentData {
  id?: string
  externalId?: string | null
  amount?: number
  paidAmount?: number | null
  platformFee?: number
  status?: string
  receiptUrl?: string | null
  createdAt?: string
}

export interface WebhookEventData {
  checkout?: WebhookCheckoutData
  subscription?: WebhookSubscriptionData
  payment?: WebhookPaymentData
  payerInformation?: { method?: string }
}
