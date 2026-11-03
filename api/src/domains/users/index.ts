import * as authActions from './actions/auth'
import type { DomainDefinition } from '../types'

export const usersDomain: DomainDefinition<typeof authActions> = {
  name: 'users',
  actions: authActions
}

export default usersDomain
