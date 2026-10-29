import type { ZodRequestBody } from '@asteasolutions/zod-to-openapi'
import type { RequestHandler } from 'express'
import type { z } from 'zod'

export type ResponseConfig = {
  description: string
  schema?: z.ZodTypeAny
}

export type ActionMetadata = {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch'
  authenticate?: boolean
  permissions?: string[]
  path: string
  summary: string
  tags: string[]
  security?: Array<Record<string, string[]>>
  responses?: Record<string, ResponseConfig>
  middlewares?: RequestHandler[]
  requestBody?: ZodRequestBody
}
