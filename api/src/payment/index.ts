import { AbacatePay } from '@abacatepay/sdk'
import env from '@config/env'
import createLogger from '@utils/logger'
import { syncPlansCache } from './plans'
import type { PaymentInstance, PaymentModule, AbacatePayClient } from './types'

const logger = createLogger('payment')

const payment: PaymentModule = {
  client: null,
  initializePayment: async (): Promise<PaymentInstance> => {
    try {
      const apiKey = env.ABACATEPAY_API_KEY

      if (!apiKey) {
        throw new Error('ABACATEPAY_API_KEY is not defined')
      }

      payment.client = AbacatePay({ secret: apiKey })

      logger.success('Connected: AbacatePay payment gateway ready')

      await syncPlansCache(payment.client)

      return { client: payment.client }
    } catch (error) {
      logger.error('[initializePayment] AbacatePay initialization error:', error)
      process.exit(1)
    }
  },
  getInstance: async (): Promise<AbacatePayClient> => {
    if (!payment.client) {
      logger.info('[getInstance] Payment client not initialized, initializing now')
      await payment.initializePayment()
      if (!payment.client) {
        logger.error('[getInstance] Failed to initialize AbacatePay client')
        throw new Error('Failed to initialize AbacatePay client')
      }
    }
    return payment.client
  },
  connect: async (): Promise<PaymentInstance> => {
    return payment.initializePayment()
  }
}

export const connect = payment.initializePayment
export const connectPayment = payment.initializePayment
export const connectAbacatePay = payment.initializePayment
export const getPaymentClient = payment.getInstance

export const checkPaymentHealth = (): 'ok' | 'error' => {
  return payment.client ? 'ok' : 'error'
}

export * from './types'
export * from './plans'
export default payment
