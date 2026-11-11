import type { checkoutResponseSchema, createCheckoutBodySchema } from './schemas'
import type { UserEntity } from '@domains/users/repositories/users/types'
import type { CachedPlan } from '@payment/plans/types'
import type { z } from 'zod'

export type CreateCheckoutRequest = { body: z.infer<typeof createCheckoutBodySchema> }

export type CheckoutResponse = z.infer<typeof checkoutResponseSchema>

export interface GatewayCheckoutParams {
  plan: CachedPlan
  user: UserEntity
  transactionId: string
  returnUrl: string
  completionUrl: string
}

export interface GatewayCheckoutResult {
  customerId: string
  checkout: {
    id: string
    url: string
    methods: string[]
    devMode: boolean
    raw: unknown
  }
}
