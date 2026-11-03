import * as actions from './actions'
import type { DomainDefinition } from '../types'

export * from './actions'
export { default as userRepository, UserModel } from './repositories'
export * from './repositories/types'
export { default as authMiddleware } from './middlewares/auth'
export { default as adminMiddleware } from './middlewares/admin'
export * from './middlewares/auth/types'
export * from './middlewares/admin/types'

export const usersDomain: DomainDefinition<typeof actions> = {
  name: 'users',
  actions
}

export default usersDomain
