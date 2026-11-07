import type { z } from 'zod'
import type { purchaseItemSchema, purchaseListResponseSchema } from './schemas'

export type PurchaseItemResponse = z.infer<typeof purchaseItemSchema>
export type PurchaseListResponse = z.infer<typeof purchaseListResponseSchema>
