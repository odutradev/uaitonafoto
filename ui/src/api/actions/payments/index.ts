import api from '@interceptor'
import type { CheckoutResponse, PlanApiItem, SubscriptionItem } from './types'

export const getPlans = async (): Promise<PlanApiItem[]> => {
  const response = await api.get<PlanApiItem[]>('/plans')
  return response.data
}

export const getPlanById = async (id: string): Promise<PlanApiItem> => {
  const response = await api.get<PlanApiItem>(`/plans/${id}`)
  return response.data
}

export const createCheckout = async (planId: string): Promise<CheckoutResponse> => {
  const response = await api.post<CheckoutResponse>('/payments/checkout', { planId })
  return response.data
}

export const getMySubscriptions = async (): Promise<SubscriptionItem[]> => {
  const response = await api.get<SubscriptionItem[]>('/payments/subscriptions')
  return response.data
}

export const cancelSubscription = async (id: string): Promise<SubscriptionItem> => {
  const response = await api.post<SubscriptionItem>(`/payments/subscriptions/${id}/cancel`)
  return response.data
}

