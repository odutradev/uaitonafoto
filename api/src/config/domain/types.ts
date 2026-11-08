import type { ActionDefinition, ActionHandler, ActionMetadata } from '@factories/defineAction/types'
import type { RateLimitConfig, DocumentedMiddleware } from '@middlewares/rateLimit/types'

export type { ActionDefinition, ActionHandler, ActionMetadata }

export interface DomainDefinition<TActions = Record<string, unknown>> {
  name: string
  actions: TActions
  rateLimit?: RateLimitConfig | DocumentedMiddleware
}

export type DomainRegistry = Map<string, DomainDefinition>
