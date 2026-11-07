import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const purchaseItemSchema = z
  .object({
    id: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d12' }),
    transactionId: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d11' }),
    subscriptionId: z.string().optional().openapi({ example: 'subs_abc123' }),
    planId: z.string().openapi({ example: 'prod_agency_essential' }),
    planType: z.string().openapi({ example: 'SUBSCRIPTION' }),
    planName: z.string().openapi({ example: 'Agência Essencial' }),
    amount: z.number().openapi({ example: 24700 }),
    currency: z.string().openapi({ example: 'BRL' }),
    credits: z.number().openapi({ example: 4 }),
    remainingCredits: z.number().openapi({ example: 3 }),
    creditType: z.enum(['free', 'paid']).openapi({ example: 'paid' }),
    extraStorageDays: z.number().openapi({ example: 0 }),
    createdAt: z.string().openapi({ example: '2026-11-06T20:00:00.000Z' })
  })
  .openapi('PurchaseItemResponse')

export const purchaseListResponseSchema = z.array(purchaseItemSchema).openapi('PurchaseListResponse')
