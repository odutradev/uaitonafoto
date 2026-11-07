import type { SubscriptionItem } from '@actions/payments/types'
import type { PlanCardData } from '@pages/public/landingPage/sections/plans/types'

export type CheckoutQueryParams = Record<'checkout' | 'payment', string>

export interface UseCheckoutReturn {
  plans: PlanCardData[]
  subscriptions: SubscriptionItem[]
  isLoadingPlans: boolean
  checkoutPlanId: string | null
  cancellingSubscriptionId: string | null
  startCheckout: (planId: string) => Promise<void>
  handleCancelSubscription: (subscriptionId: string) => Promise<boolean>
}
