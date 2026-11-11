import type { listLogsQuerySchema, listLogsResponseSchema, logItemSchema } from './schemas'
import type { z } from 'zod'

export type ListLogsRequest = { query: z.infer<typeof listLogsQuerySchema> }
export type LogItemResponse = z.infer<typeof logItemSchema>
export type ListLogsResponse = z.infer<typeof listLogsResponseSchema>
