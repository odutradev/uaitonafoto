import type { cancelSubscriptionParamsSchema, subscriptionListResponseSchema, subscriptionSchema } from './schemas'
import type { z } from 'zod'

export type SubscriptionResponse = z.infer<typeof subscriptionSchema>

export type SubscriptionListResponse = z.infer<typeof subscriptionListResponseSchema>

export type CancelSubscriptionRequest = {
  params: z.infer<typeof cancelSubscriptionParamsSchema>
}
