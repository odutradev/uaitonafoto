import type { LandingPageData } from '../data'
import type { PlanCardData, UpsellBannerData } from '../sections/plans/types'
import type { AuthUser } from '@stores/auth/types'

export interface UseLandingPageReturn {
  isDark: boolean
  plans: PlanCardData[]
  upsell: UpsellBannerData | null
  isLoadingPlans: boolean
  data: LandingPageData
  user: AuthUser | null
  onSelectPlan: (plan: PlanCardData) => void
  onSelectUpsell: (upsell: UpsellBannerData) => void
}
