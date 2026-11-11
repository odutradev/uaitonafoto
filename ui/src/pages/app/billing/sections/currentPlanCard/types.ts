import type { SubscriptionItem } from '@utils/types/payments'

export interface CurrentPlanCardProps {
  subscriptions: SubscriptionItem[]
  cancellingId: string | null
  isCheckoutBusy: boolean
  onCancelSubscription: (subscriptionId: string) => Promise<boolean>
}
