import type { Options } from 'express-rate-limit'
import type { RequestHandler } from 'express'
import type { ResponseConfig } from '@factories/defineAction/types'

export type RateLimitOptions = Partial<Options>

export type RateLimitConfig = Partial<Options> & {
  domainName?: string
  endpointPath?: string
  message?: string
}

export type DocumentedMiddleware = RequestHandler & {
  authenticate?: boolean
  responses?: Record<string | number, ResponseConfig>
}
