import * as authActions from './actions/auth'

import type { DomainDefinition } from '@config/domain'

export const usersDomain: DomainDefinition<typeof authActions> = {
  name: 'users',
  actions: authActions
}

export default usersDomain
