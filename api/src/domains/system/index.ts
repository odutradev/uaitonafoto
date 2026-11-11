import * as adminActions from './actions/admin'
import { healthCheck } from './actions/health'
import { listLogs } from './actions/logs'

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
