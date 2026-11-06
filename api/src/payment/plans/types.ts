export type PlanType = 'ONE_TIME' | 'SUBSCRIPTION' | 'UPSELL'

export interface PlanConfig {
  abacateProductId: string
  type: PlanType
  credits: number
  extraStorageDays?: number
}

export interface CachedPlan extends PlanConfig {
  productId?: string
  name: string
  description: string
  price: number
  imageUrl: string | null
  currency: string
  devMode?: boolean
}

