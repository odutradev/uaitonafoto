import api from '@interceptor'
import type {
  CheckoutResponse,
  ClaimFreeTrialResponse,
  CreditUsageItem,
  GetMyTransactionsParams,
  PaginatedTransactionsResponse,
  PlanApiItem,
  PurchaseItem,
  SubscriptionItem
} from './types'

export const getPlans = async (): Promise<PlanApiItem[]> => {
  const response = await api.get<PlanApiItem[]>('/plans/list')
  return response.data
}

export const getPlanById = async (id: string): Promise<PlanApiItem> => {
  const response = await api.get<PlanApiItem>(`/plans/${id}/details`)
  return response.data
}

export const createCheckout = async (planId: string): Promise<CheckoutResponse> => {
  const response = await api.post<CheckoutResponse>('/payments/checkout', { planId })
  return response.data
}

export const claimFreeTrial = async (): Promise<ClaimFreeTrialResponse> => {
  const response = await api.post<ClaimFreeTrialResponse>('/payments/free-trial/claim')
  return response.data
}

export const getMySubscriptions = async (): Promise<SubscriptionItem[]> => {
  const response = await api.get<SubscriptionItem[]>('/payments/subscriptions/list')
  return response.data
}

export const cancelSubscription = async (id: string): Promise<SubscriptionItem> => {
  const response = await api.post<SubscriptionItem>(`/payments/subscriptions/${id}/cancel`)
  return response.data
}

export const getMyTransactions = async (
  params?: GetMyTransactionsParams
): Promise<PaginatedTransactionsResponse> => {
  const response = await api.get<PaginatedTransactionsResponse>('/payments/transactions/list', { params })
  return response.data
}

export const getMyPurchases = async (): Promise<PurchaseItem[]> => {
  const response = await api.get<PurchaseItem[]>('/payments/purchases/list')
  return response.data
}

export const getMyCreditUsages = async (): Promise<CreditUsageItem[]> => {
  const response = await api.get<CreditUsageItem[]>('/payments/credit-usages/list')
  return response.data
}

