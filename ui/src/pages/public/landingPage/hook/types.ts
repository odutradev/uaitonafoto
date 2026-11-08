import type { LandingPageData } from '../data'
import type { PlanCardData } from '../sections/plans/types'
import type { AuthUser } from '@stores/auth/types'

export interface UseLandingPageReturn {
  isDark: boolean
  plans: PlanCardData[]
  isLoadingPlans: boolean
  data: LandingPageData
  user: AuthUser | null
  onSelectPlan: (plan: PlanCardData) => void
}
