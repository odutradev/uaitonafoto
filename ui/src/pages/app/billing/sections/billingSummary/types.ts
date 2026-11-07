import type { SubscriptionItem } from '@actions/payments/types'

export interface BillingSummaryProps {
  paidCredits: number
  freeCredits: number
  freeTrialClaimed: boolean
  activeSubscription: SubscriptionItem | null
  isCheckingOutFreeTrial: boolean
  isCheckoutBusy: boolean
  onClaimFreeTrial: () => void
}
