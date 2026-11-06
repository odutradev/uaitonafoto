import type { PlanCardData } from '@pages/public/landingPage/sections/plans/types'

export type CheckoutQueryParams = Record<'checkout' | 'payment', string>

export interface UseCheckoutReturn {
  plans: PlanCardData[]
  isLoadingPlans: boolean
  checkoutPlanId: string | null
  startCheckout: (planId: string) => Promise<void>
}
