import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const creditUsageItemSchema = z
  .object({
    id: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d15' }),
    userId: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d10' }),
    eventId: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d11' }),
    eventName: z.string().openapi({ example: 'Casamento Maria & João' }),
    creditType: z.enum(['free', 'paid']).openapi({ example: 'paid' }),
    amount: z.number().openapi({ example: 1 }),
    createdAt: z.string().openapi({ example: '2026-11-06T20:00:00.000Z' })
  })
  .openapi('CreditUsageItemResponse')

export const creditUsageListResponseSchema = z.array(creditUsageItemSchema).openapi('CreditUsageListResponse')
