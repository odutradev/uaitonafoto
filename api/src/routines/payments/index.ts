import remindSubscriptionRenewals from './remindSubscriptionRenewals'
import expirePendingTransactions from './expirePendingTransactions'
import reconcileSubscriptions from './reconcileSubscriptions'

import type { RoutineDivisionDefinition } from '@config/routine'

const routines = {
  expirePendingTransactions,
  reconcileSubscriptions,
  remindSubscriptionRenewals
}

export const paymentsRoutines: RoutineDivisionDefinition<typeof routines> = {
  name: 'payments',
  routines
}

export default paymentsRoutines

