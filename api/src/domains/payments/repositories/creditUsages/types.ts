import type { CreditType } from '@domains/users/repositories/users/types'

export interface CreditUsageEntity {
  id: string
  userId: string
  eventId: string
  eventName: string
  creditType: CreditType
  amount: number
  createdAt: string
}

export type CreateCreditUsagePayload = Omit<CreditUsageEntity, 'id' | 'createdAt'> & {
  createdAt?: string
}
