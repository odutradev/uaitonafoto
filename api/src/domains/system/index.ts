import { healthCheck } from './actions/health'
import { listLogs } from './actions/logs'
import * as adminActions from './actions/admin'

import type { DomainDefinition } from '@config/domain'

export const systemDomain: DomainDefinition = {
  name: 'system',
  actions: {
    healthCheck,
    listLogs,
    admin: adminActions
  }
}

export default systemDomain
