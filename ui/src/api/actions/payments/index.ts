import api from '@interceptor'
import type { CheckoutResponse, PlanApiItem } from './types'

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

export * from './types'

