import type { z } from 'zod'
import type { errorResponseSchema } from './schemas'

export type ErrorResponse = z.infer<typeof errorResponseSchema>
