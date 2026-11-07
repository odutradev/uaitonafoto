import type { z } from 'zod'
import type {
  cancelSubscriptionParamsSchema,
  subscriptionListResponseSchema,
  subscriptionSchema
} from './schemas'

export type SubscriptionResponse = z.infer<typeof subscriptionSchema>

export type SubscriptionListResponse = z.infer<typeof subscriptionListResponseSchema>

export type CancelSubscriptionRequest = {
  params: z.infer<typeof cancelSubscriptionParamsSchema>
}
