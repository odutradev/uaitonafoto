import type { SubscriptionItem } from '@actions/payments/types'

export interface SubscriptionsProps {
  subscriptions: SubscriptionItem[]
  cancellingId: string | null
  onCancelSubscription: (id: string) => Promise<boolean>
}

