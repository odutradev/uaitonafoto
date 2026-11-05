import type { DomainDefinition } from '@config/domain'

export const systemDomain: DomainDefinition<Record<string, never>> = {
  name: 'system',
  actions: {}
}

export default systemDomain
