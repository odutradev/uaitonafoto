import type { CreditType } from '@domains/users/repositories/types'

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
