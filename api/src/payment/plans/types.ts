export type PlanType = 'ONE_TIME' | 'SUBSCRIPTION'

export interface PlanConfig {
  abacateProductId: string
  type: PlanType
  credits: number
}

export interface CachedPlan extends PlanConfig {
  name: string
  description: string
  price: number
  imageUrl: string | null
  currency: string
  devMode?: boolean
}

