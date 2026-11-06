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
