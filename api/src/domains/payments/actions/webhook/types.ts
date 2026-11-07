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

export interface WebhookEventData {
  checkout?: WebhookCheckoutData
  payerInformation?: { method?: string }
}

