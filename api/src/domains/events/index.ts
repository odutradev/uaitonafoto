import * as eventActions from './actions/event'
import * as teamActions from './actions/team'
import * as guestActions from './actions/guest'
import type { DomainDefinition } from '@config/domain'

const actions = {
  event: eventActions,
  team: teamActions,
  guest: guestActions
}

export const eventsDomain: DomainDefinition<typeof actions> = {
  name: 'events',
  actions
}

export default eventsDomain
