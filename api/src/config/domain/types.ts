import type { ActionDefinition, ActionHandler, ActionMetadata } from '@factories/defineAction/types'

export type { ActionDefinition, ActionHandler, ActionMetadata }

export interface DomainDefinition<TActions = Record<string, unknown>> {
  name: string
  actions: TActions
}

export type DomainRegistry = Map<string, DomainDefinition>
