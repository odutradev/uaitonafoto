export interface DomainDefinition<TActions = Record<string, unknown>> {
  name: string
  actions: TActions
}
