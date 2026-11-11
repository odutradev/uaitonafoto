import type { purchaseItemSchema, purchaseListResponseSchema } from './schemas'
import type { z } from 'zod'

export type PurchaseItemResponse = z.infer<typeof purchaseItemSchema>
export type PurchaseListResponse = z.infer<typeof purchaseListResponseSchema>
