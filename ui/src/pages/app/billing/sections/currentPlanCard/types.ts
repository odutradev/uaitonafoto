import type { SubscriptionItem } from '@actions/payments/types'

export interface CurrentPlanCardProps {
  subscriptions: SubscriptionItem[]
  cancellingId: string | null
  checkoutPlanId: string | null
  hasExtraCreditPlan: boolean
  onBuyExtraCredit: () => void
  onCancelSubscription: (subscriptionId: string) => Promise<boolean>
}
