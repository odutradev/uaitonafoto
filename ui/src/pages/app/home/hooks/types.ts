import type { SubscriptionItem, TransactionItem } from '@actions/payments/types'
import type { PlanCardData } from '@pages/public/landingPage/sections/plans/types'

export type CheckoutQueryParams = Record<'checkout' | 'payment', string>

export interface UseCheckoutReturn {
  plans: PlanCardData[]
  subscriptions: SubscriptionItem[]
  invoices: TransactionItem[]
  invoicesPage: number
  invoicesTotalPages: number
  isLoadingPlans: boolean
  isLoadingInvoices: boolean
  checkoutPlanId: string | null
  cancellingSubscriptionId: string | null
  startCheckout: (planId: string) => Promise<void>
  handleCancelSubscription: (subscriptionId: string) => Promise<boolean>
  handleInvoicesPageChange: (nextPage: number) => void
}
