export type PlanType = 'ONE_TIME' | 'SUBSCRIPTION' | 'UPSELL'

export interface PlanApiItem {
  abacateProductId: string
  productId?: string
  type: PlanType
  credits: number
  extraStorageDays?: number
  name: string
  description: string
  price: number // em centavos
  imageUrl: string | null
  currency: string
  devMode?: boolean
}

