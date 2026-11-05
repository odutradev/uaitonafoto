import { healthCheck } from './actions/health'

import type { DomainDefinition } from '@config/domain'

export const systemDomain: DomainDefinition = {
  name: 'system',
  actions: {
    healthCheck
  }
}

export default systemDomain
