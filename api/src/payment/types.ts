import type { AbacatePay } from '@abacatepay/sdk'

export type AbacatePayClient = ReturnType<typeof AbacatePay>

export interface PaymentInstance {
  client: AbacatePayClient
}

export interface PaymentModule {
  client: AbacatePayClient | null
  initializePayment: () => Promise<PaymentInstance>
  getInstance: () => Promise<AbacatePayClient>
  connect: () => Promise<PaymentInstance>
}
