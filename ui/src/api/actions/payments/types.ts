export type PlanType = 'ONE_TIME' | 'SUBSCRIPTION' | 'UPSELL' | 'FREE'

export interface PlanApiItem {
  id: string
  abacateProductId: string
  productId?: string
  type: PlanType
  credits: number
  extraStorageDays?: number
  name: string
  title?: string
  description: string
  price: number // em centavos
  imageUrl: string | null
  currency: string
  features: string[]
  tag?: string
  badge?: string
  subBadge?: string
  costPerEvent?: string
  period?: string
  ctaText?: string
  ctaHref: string
  highlighted?: boolean
  devMode?: boolean
}


export interface CheckoutResponse {
  transactionId: string
  checkoutId: string
  checkoutUrl: string
}

export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELLED'

export interface SubscriptionItem {
  id: string
  subscriptionId: string
  planId: string
  planName: string
  amount: number
  currency: string
  creditsPerCycle: number
  frequency: string
  method?: string
  status: SubscriptionStatus
  cyclesCompleted: number
  lastPaidAt: string
  nextBillingAt?: string
  cancelledAt?: string
  createdAt: string
}
