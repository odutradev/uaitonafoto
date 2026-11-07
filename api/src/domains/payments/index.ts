import * as plansActions from './actions/plans'
import * as checkoutActions from './actions/checkout'
import * as webhookActions from './actions/webhook'
import * as subscriptionsActions from './actions/subscriptions'
import type { DomainDefinition } from '@config/domain'

const actions = {
  plans: plansActions,
  checkout: checkoutActions,
  webhook: webhookActions,
  subscriptions: subscriptionsActions
}

export const paymentsDomain: DomainDefinition<typeof actions> = {
  name: 'payments',
  actions
}

export default paymentsDomain
