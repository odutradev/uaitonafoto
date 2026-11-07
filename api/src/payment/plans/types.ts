export type PlanType = 'ONE_TIME' | 'SUBSCRIPTION' | 'UPSELL' | 'FREE'

export interface PlanConfig {
  id: string
  abacateProductId: string
  type: PlanType
  credits: number
  rolloverDays?: number
  maxAccumulatedCredits?: number
  extraStorageDays?: number
  name: string
  title?: string
  description: string
  price: number
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
}

export interface CachedPlan extends PlanConfig {
  productId?: string
  imageUrl: string | null
  devMode?: boolean
}

