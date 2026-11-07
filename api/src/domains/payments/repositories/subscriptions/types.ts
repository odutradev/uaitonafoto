export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELLED'

export interface SubscriptionEntity {
  id: string
  subscriptionId: string
  userId: string
  initialTransactionId: string
  checkoutId?: string
  customerId?: string
  planId: string
  planName: string
  abacateProductId: string
  planSnapshot: unknown
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
  cancelReason?: string
  devMode: boolean
  createdAt: string
  updatedAt: string
}

export interface UpsertSubscriptionPayload {
  subscriptionId: string
  userId: string
  initialTransactionId: string
  checkoutId?: string
  customerId?: string
  planId: string
  planName: string
  abacateProductId: string
  planSnapshot: unknown
  amount: number
  currency: string
  creditsPerCycle: number
  frequency?: string
  method?: string
  status?: SubscriptionStatus
  lastPaidAt: string
  nextBillingAt?: string
  devMode: boolean
}

export interface RecordRenewalPayload {
  lastPaidAt: string
  nextBillingAt?: string
  method?: string
}

export interface UpdateSubscriptionStatusPayload {
  status: SubscriptionStatus
  cancelledAt?: string
  cancelReason?: string
}
