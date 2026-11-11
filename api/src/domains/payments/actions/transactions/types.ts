import type { listTransactionsQuerySchema, listTransactionsResponseSchema, transactionItemSchema } from './schemas'
import type { z } from 'zod'

export type TransactionItemResponse = z.infer<typeof transactionItemSchema>

export type ListTransactionsRequest = {
  query: z.infer<typeof listTransactionsQuerySchema>
}

export type ListTransactionsResponse = z.infer<typeof listTransactionsResponseSchema>
