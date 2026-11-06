import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const webhookQuerySchema = z
  .object({
    webhookSecret: z.string().min(1).openapi({ example: 'secret-configurado-no-abacatepay' })
  })
  .openapi('PaymentWebhookQuery')

export const webhookBodySchema = z
  .object({
    id: z.string().optional(),
    event: z.string().optional(),
    type: z.string().optional(),
    devMode: z.boolean().optional(),
    data: z.record(z.unknown())
  })
  .passthrough()
  .openapi('PaymentWebhookBody')

export const webhookResponseSchema = z
  .object({
    received: z.boolean().openapi({ example: true })
  })
  .openapi('PaymentWebhookResponse')
