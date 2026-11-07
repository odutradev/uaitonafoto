import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const subscriptionStatusSchema = z
  .enum(['ACTIVE', 'PAST_DUE', 'CANCELLED'])
  .openapi({ example: 'ACTIVE' })

export const subscriptionSchema = z
  .object({
    id: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d22' }),
    subscriptionId: z.string().openapi({ example: 'subs_abc123' }),
    planId: z.string().openapi({ example: 'prod_agency_essential' }),
    planName: z.string().openapi({ example: 'Agência Essencial' }),
    amount: z.number().openapi({ example: 24700 }),
    currency: z.string().openapi({ example: 'BRL' }),
    creditsPerCycle: z.number().openapi({ example: 4 }),
    frequency: z.string().openapi({ example: 'MONTHLY' }),
    method: z.string().optional().openapi({ example: 'CARD' }),
    status: subscriptionStatusSchema,
    cyclesCompleted: z.number().openapi({ example: 1 }),
    lastPaidAt: z.string().openapi({ example: '2026-11-06T20:00:00.000Z' }),
    nextBillingAt: z.string().optional().openapi({ example: '2026-12-06T20:00:00.000Z' }),
    cancelledAt: z.string().optional().openapi({ example: '2026-11-15T12:00:00.000Z' }),
    createdAt: z.string().openapi({ example: '2026-11-06T20:00:00.000Z' })
  })
  .openapi('SubscriptionResponse')

export const subscriptionListResponseSchema = z
  .array(subscriptionSchema)
  .openapi('SubscriptionListResponse')

export const cancelSubscriptionParamsSchema = z
  .object({
    id: z.string().min(1).openapi({ example: '665f1c2e9b1e8a001c8e4d22' })
  })
  .openapi('CancelSubscriptionParams')
