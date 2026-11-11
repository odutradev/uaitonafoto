import type { CreditType } from '@domains/users/repositories/users/types'

export interface PurchaseEntity {
  id: string
  userId: string
  transactionId: string
  subscriptionId?: string
  planId: string
  planType: string
  planName: string
  abacateProductId: string
  planSnapshot: unknown
  amount: number
  currency: string
  credits: number
  remainingCredits: number
  expiredCredits: number
  creditsExpiresAt?: string
  creditsExpiredAt?: string
  creditType: CreditType
  extraStorageDays: number
  createdAt: string
}

export type CreatePurchasePayload = Omit<
  PurchaseEntity,
  'id' | 'remainingCredits' | 'expiredCredits' | 'creditsExpiredAt' | 'createdAt'
> & {
  remainingCredits?: number
}
