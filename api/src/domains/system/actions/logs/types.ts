import type { z } from 'zod'
import type { listLogsQuerySchema, listLogsResponseSchema, logItemSchema } from './schemas'

export type ListLogsRequest = { query: z.infer<typeof listLogsQuerySchema> }
export type LogItemResponse = z.infer<typeof logItemSchema>
export type ListLogsResponse = z.infer<typeof listLogsResponseSchema>
