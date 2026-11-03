import * as actions from './actions'
import type { DomainDefinition } from '../types'

export { default as logRepository, LogModel } from './repositories'
export * from './repositories/types'
export * from './actions'

export const systemDomain: DomainDefinition<typeof actions> = {
  name: 'system',
  actions
}

export default systemDomain
