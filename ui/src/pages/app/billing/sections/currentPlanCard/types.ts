import type { SubscriptionItem } from '@actions/payments/types'

export interface CurrentPlanCardProps {
  subscriptions: SubscriptionItem[]
  cancellingId: string | null
  isCheckoutBusy: boolean
  onCancelSubscription: (subscriptionId: string) => Promise<boolean>
}
