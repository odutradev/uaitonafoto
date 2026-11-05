export interface DomainDefinition<TActions = Record<string, unknown>> {
  name: string
  actions: TActions
}

export type DomainRegistry = Map<string, DomainDefinition>
