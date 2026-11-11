import * as subscriptionsActions from './actions/subscriptions'
import * as transactionsActions from './actions/transactions'
import * as creditUsagesActions from './actions/creditUsages'
import { paymentsRateLimiter } from '@middlewares/rateLimit'
import * as freeTrialActions from './actions/freeTrial'
import * as purchasesActions from './actions/purchases'
import * as checkoutActions from './actions/checkout'
import * as webhookActions from './actions/webhook'
import * as plansActions from './actions/plans'

import type { DomainDefinition } from '@config/domain'

const actions = {
  plans: plansActions,
  checkout: checkoutActions,
  freeTrial: freeTrialActions,
  webhook: webhookActions,
  subscriptions: subscriptionsActions,
  transactions: transactionsActions,
  purchases: purchasesActions,
  creditUsages: creditUsagesActions
}

export const paymentsDomain: DomainDefinition<typeof actions> = {
  name: 'payments',
  rateLimit: paymentsRateLimiter,
  actions
}

export default paymentsDomain
