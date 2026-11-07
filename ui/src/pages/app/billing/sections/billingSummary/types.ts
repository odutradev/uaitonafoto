export interface BillingSummaryProps {
  paidCredits: number
  freeCredits: number
  freeTrialClaimed: boolean
  isCheckingOutFreeTrial: boolean
  isCheckoutBusy: boolean
  onClaimFreeTrial: () => void
}
