import type { PurchaseItem, SubscriptionItem } from '@actions/payments/types'

export interface BillingSummaryProps {
  paidCredits: number
  freeCredits: number
  freeTrialClaimed: boolean
  activeSubscription: SubscriptionItem | null
  purchases: PurchaseItem[]
  isCheckingOutFreeTrial: boolean
  isCheckoutBusy: boolean
  onClaimFreeTrial: () => void
}
