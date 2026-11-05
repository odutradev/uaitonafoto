import type { z } from 'zod'
import type { healthCheckResponseSchema, healthCheckServicesSchema } from './schemas'

export type HealthCheckServices = z.infer<typeof healthCheckServicesSchema>
export type HealthCheckResponse = z.infer<typeof healthCheckResponseSchema>
