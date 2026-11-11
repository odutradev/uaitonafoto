import type { PlanApiItem } from '@utils/types/payments'

export interface CreditsAndPlansProps {
  plans: PlanApiItem[]
  isLoading: boolean
  checkoutPlanId: string | null
  activeSubscriptionPlanIds: string[]
  hasActiveSubscription: boolean
  onSelectPlan: (planId: string) => void
}
