import { healthCheck } from './actions/health'
import { listLogs } from './actions/logs'

import type { DomainDefinition } from '@config/domain'

export const systemDomain: DomainDefinition = {
  name: 'system',
  actions: {
    healthCheck,
    listLogs
  }
}

export default systemDomain
