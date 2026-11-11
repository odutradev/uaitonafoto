import type { creditUsageItemSchema, creditUsageListResponseSchema } from './schemas'
import type { z } from 'zod'

export type CreditUsageItemResponse = z.infer<typeof creditUsageItemSchema>
export type CreditUsageListResponse = z.infer<typeof creditUsageListResponseSchema>
