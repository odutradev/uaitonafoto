export interface EventsOverviewProps {
  paidCredits: number
  freeCredits: number
  freeTrialClaimed: boolean
  onGoToBilling: () => void
}
