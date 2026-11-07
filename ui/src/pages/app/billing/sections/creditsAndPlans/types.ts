import type { PlanApiItem } from '@actions/payments/types'

export interface CreditsAndPlansProps {
  plans: PlanApiItem[]
  isLoading: boolean
  checkoutPlanId: string | null
  activeSubscriptionPlanIds: string[]
  hasActiveSubscription: boolean
  onSelectPlan: (planId: string) => void
}
