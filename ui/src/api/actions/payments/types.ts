import type { AuthUser } from '@stores/auth/types'

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

export interface ClaimFreeTrialResponse {
  user: AuthUser
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

export type TransactionStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'DISPUTED' | 'EXPIRED' | 'CANCELLED'

export interface TransactionItem {
  id: string
  planId: string
  planType: string
  planName: string
  amount: number
  paidAmount?: number
  currency: string
  status: TransactionStatus
  paymentMethod?: string
  checkoutUrl?: string
  receiptUrl?: string
  subscriptionId?: string
  paidAt?: string
  createdAt: string
}

export interface PurchaseItem {
  id: string
  transactionId: string
  subscriptionId?: string
  planId: string
  planType: string
  planName: string
  amount: number
  currency: string
  credits: number
  remainingCredits: number
  creditType: 'free' | 'paid'
  extraStorageDays: number
  createdAt: string
}

export interface PaginationMeta {
  totalPages: number
  limit: number
  total: number
  page: number
}

export interface PaginatedTransactionsResponse {
  meta: PaginationMeta
  data: TransactionItem[]
}

export interface GetMyTransactionsParams {
  page?: number
  limit?: number
  status?: TransactionStatus
  planType?: string
}
