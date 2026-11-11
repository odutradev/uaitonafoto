import type { healthCheckResponseSchema, healthCheckServicesSchema } from './schemas'
import type { z } from 'zod'

export type HealthCheckServices = z.infer<typeof healthCheckServicesSchema>
export type HealthCheckResponse = z.infer<typeof healthCheckResponseSchema>
