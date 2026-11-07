import type { z } from 'zod'
import type {
  listTransactionsQuerySchema,
  listTransactionsResponseSchema,
  transactionItemSchema
} from './schemas'

export type TransactionItemResponse = z.infer<typeof transactionItemSchema>

export type ListTransactionsRequest = {
  query: z.infer<typeof listTransactionsQuerySchema>
}

export type ListTransactionsResponse = z.infer<typeof listTransactionsResponseSchema>
