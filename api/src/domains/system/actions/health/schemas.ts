import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const serviceStatusSchema = z.enum(['ok', 'error', 'disabled'])

export const healthCheckServicesSchema = z
  .object({
    database: serviceStatusSchema.openapi({ example: 'ok' }),
    firebase: serviceStatusSchema.openapi({ example: 'ok' }),
    email: serviceStatusSchema.openapi({ example: 'ok' }),
    payment: serviceStatusSchema.openapi({ example: 'ok' })
  })
  .openapi('HealthCheckServices')

export const healthCheckResponseSchema = z
  .object({
    status: z.enum(['ok', 'degraded']).openapi({ example: 'ok' }),
    mode: z.string().openapi({ example: 'development' }),
    version: z.string().openapi({ example: '1.0.0' }),
    services: healthCheckServicesSchema
  })
  .openapi('HealthCheckResponse')
