import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const createCheckoutBodySchema = z
  .object({
    planId: z.string().min(1).openapi({ example: 'prod_b2c_event_pass' })
  })
  .openapi('CreateCheckoutBody')

export const checkoutResponseSchema = z
  .object({
    transactionId: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d11' }),
    checkoutId: z.string().openapi({ example: 'bill_abc123' }),
    checkoutUrl: z.string().url().openapi({ example: 'https://app.abacatepay.com/pay/bill_abc123' })
  })
  .openapi('CheckoutResponse')
