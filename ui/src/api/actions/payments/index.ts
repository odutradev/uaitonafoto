import api from '@interceptor'
import type { PlanApiItem } from './types'

export const getPlans = async (): Promise<PlanApiItem[]> => {
  const response = await api.get<PlanApiItem[]>('/plans')
  return response.data
}

export const getPlanById = async (id: string): Promise<PlanApiItem> => {
  const response = await api.get<PlanApiItem>(`/plans/${id}`)
  return response.data
}

export * from './types'

