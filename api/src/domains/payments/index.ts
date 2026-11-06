import * as plansActions from './actions/plans'
import * as checkoutActions from './actions/checkout'
import * as webhookActions from './actions/webhook'
import type { DomainDefinition } from '@config/domain'

const actions = { plans: plansActions, checkout: checkoutActions, webhook: webhookActions }

export const paymentsDomain: DomainDefinition<typeof actions> = {
  name: 'payments',
  actions
}

export default paymentsDomain
