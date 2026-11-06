import type { LandingPageData } from '../data'
import type { PlanCardData, UpsellBannerData } from '../sections/plans/types'

export interface UseLandingPageReturn {
  isDark: boolean
  plans: PlanCardData[]
  upsell: UpsellBannerData | null
  isLoadingPlans: boolean
  data: LandingPageData
  onSelectPlan: (plan: PlanCardData) => void
  onSelectUpsell: (upsell: UpsellBannerData) => void
}
