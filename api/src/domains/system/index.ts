import type { DomainDefinition } from '../types'

export const systemDomain: DomainDefinition<Record<string, never>> = {
  name: 'system',
  actions: {}
}

export default systemDomain
