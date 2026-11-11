import type { DocumentedMiddleware } from '@factories/defineAction/types'
import type { Options } from 'express-rate-limit'

export type RateLimitOptions = Partial<Options>

export type RateLimitConfig = Partial<Options> & {
  domainName?: string
  endpointPath?: string
  message?: string
}

export type { DocumentedMiddleware }
