import * as plansActions from './actions/plans'
import type { DomainDefinition } from '@config/domain'

export const paymentsDomain: DomainDefinition<typeof plansActions> = {
  name: 'payments',
  actions: plansActions
}

export default paymentsDomain

