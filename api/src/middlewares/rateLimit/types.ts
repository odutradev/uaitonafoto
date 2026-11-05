import type { Options } from 'express-rate-limit'
import type { DocumentedMiddleware } from '@factories/defineAction/types'

export type RateLimitOptions = Partial<Options>

export type RateLimitConfig = Partial<Options> & {
  domainName?: string
  endpointPath?: string
  message?: string
}

export type { DocumentedMiddleware }
