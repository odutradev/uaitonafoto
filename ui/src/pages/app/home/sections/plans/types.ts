import type { PlanCardData } from '@pages/public/landingPage/sections/plans/types'

export interface PlansProps {
  plans: PlanCardData[]
  isLoading: boolean
  checkoutPlanId: string | null
  activeSubscriptionPlanIds?: string[]
  freeTrialClaimed?: boolean
  freeCredits: number
  paidCredits: number
  onSelectPlan: (planId: string) => void
}
