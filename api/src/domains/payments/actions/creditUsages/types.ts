import type { z } from 'zod'
import type { creditUsageItemSchema, creditUsageListResponseSchema } from './schemas'

export type CreditUsageItemResponse = z.infer<typeof creditUsageItemSchema>
export type CreditUsageListResponse = z.infer<typeof creditUsageListResponseSchema>
