import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

import { createPaginatedSchema, paginationQuerySchema } from '@factories/pagination/schemas'

extendZodWithOpenApi(z)

export const transactionStatusSchema = z
  .enum(['PENDING', 'PAID', 'REFUNDED', 'DISPUTED', 'EXPIRED', 'CANCELLED'])
  .openapi({ example: 'PAID' })

export const transactionItemSchema = z
  .object({
    id: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d11' }),
    planId: z.string().openapi({ example: 'prod_agency_essential' }),
    planType: z.string().openapi({ example: 'SUBSCRIPTION' }),
    planName: z.string().openapi({ example: 'Agência Essencial' }),
    amount: z.number().openapi({ example: 24700 }),
    paidAmount: z.number().optional().openapi({ example: 24700 }),
    currency: z.string().openapi({ example: 'BRL' }),
    status: transactionStatusSchema,
    cancelReason: z.string().optional().openapi({ example: 'cancelled_by_user' }),
    paymentMethod: z.string().optional().openapi({ example: 'PIX' }),
    checkoutUrl: z.string().optional().openapi({ example: 'https://app.abacatepay.com/pay/bill_abc123' }),
    receiptUrl: z.string().optional().openapi({ example: 'https://app.abacatepay.com/receipt/bill_abc123' }),
    subscriptionId: z.string().optional().openapi({ example: 'subs_abc123' }),
    paidAt: z.string().optional().openapi({ example: '2026-11-06T20:00:00.000Z' }),
    createdAt: z.string().openapi({ example: '2026-11-06T19:58:00.000Z' })
  })
  .openapi('TransactionItemResponse')

export const listTransactionsQuerySchema = z
  .object({
    status: transactionStatusSchema.optional().openapi({
      param: { description: 'Filtrar transações por status (ex: PAID)' }
    }),
    planType: z.string().optional().openapi({
      example: 'SUBSCRIPTION',
      param: { description: 'Filtrar transações por tipo de plano (ex: SUBSCRIPTION, ONE_TIME)' }
    })
  })
  .merge(paginationQuerySchema)
  .openapi('ListTransactionsQuery')

export const listTransactionsResponseSchema = createPaginatedSchema(
  transactionItemSchema,
  'ListTransactionsResponse'
)
