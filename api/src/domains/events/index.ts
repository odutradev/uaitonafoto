import * as eventActions from './actions/event'
import type { DomainDefinition } from '@config/domain'

const actions = {
  event: eventActions
}

export const eventsDomain: DomainDefinition<typeof actions> = {
  name: 'events',
  actions
}

export default eventsDomain
