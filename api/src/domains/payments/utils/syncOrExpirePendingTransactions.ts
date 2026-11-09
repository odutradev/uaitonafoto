import env from '@config/env'
import { getPaymentClient } from '@payment'
import createLogger from '@utils/logger'
import transactionRepository from '../repositories/transactions'
import confirmPayment from './confirmPayment'

import type { TransactionEntity } from '../repositories/transactions/types'

const logger = createLogger('payments:expire-sync')

export interface SyncOrExpireOptions {
  userId?: string
  expirationHours?: number
  checkGateway?: boolean
  maxGatewayChecks?: number
}

export interface SyncOrExpireResult {
  expiredCount: number
  gatewayUpdatedCount: number
}

const syncTransactionWithGateway = async (tx: TransactionEntity): Promise<boolean> => {
  try {
    const client = await getPaymentClient()

    if (tx.planType === 'SUBSCRIPTION') {
      const subRes = await client.subscriptions.get({ externalId: tx.id }).catch(() => null)
      if (!subRes?.data) return false

      const sub = subRes.data
      if (sub.status === 'ACTIVE') {
        await confirmPayment(tx, {
          subscription: {
            id: sub.id,
            amount: sub.amount,
            method: sub.method,
            status: sub.status
          }
        })
        return true
      }

      if (sub.status === 'CANCELLED') {
        await transactionRepository.update(tx.id, {
          status: 'CANCELLED',
          cancelReason: 'subscription_cancelled'
        })
        return true
      }
      return false
    }

    if (tx.checkoutId) {
      const checkoutRes = await client.checkouts.get(tx.checkoutId).catch(() => null)
      if (!checkoutRes?.data) return false

      const checkout = checkoutRes.data
      if (checkout.status === 'PAID') {
        await confirmPayment(tx, {
          checkout: {
            id: checkout.id,
            externalId: checkout.externalId ?? undefined,
            paidAmount: checkout.paidAmount ?? undefined,
            platformFee: checkout.platformFee ?? undefined
          }
        })
        return true
      }

      if (checkout.status === 'EXPIRED') {
        await transactionRepository.update(tx.id, {
          status: 'EXPIRED',
          cancelReason: 'checkout_expired'
        })
        return true
      }

      if (checkout.status === 'CANCELLED') {
        await transactionRepository.update(tx.id, {
          status: 'CANCELLED',
          cancelReason: 'checkout_cancelled'
        })
        return true
      }
    }
  } catch (error) {
    logger.warn(`Failed to sync pending transaction ${tx.id} with gateway:`, error)
  }

  return false
}

export const syncOrExpirePendingTransactions = async (
  options?: SyncOrExpireOptions
): Promise<SyncOrExpireResult> => {
  const expirationHours = options?.expirationHours ?? env.CHECKOUT_EXPIRATION_HOURS ?? 24
  const cutoffTimeMs = Date.now() - expirationHours * 60 * 60 * 1000
  const cutoffIso = new Date(cutoffTimeMs).toISOString()

  const expiredCount = await transactionRepository.expirePendingOlderThan(cutoffIso, options?.userId)

  let gatewayUpdatedCount = 0

  if (options?.checkGateway) {
    const pendingList = await transactionRepository.listPending(options?.userId)
    const maxChecks = options?.maxGatewayChecks ?? 10
    const toCheck = pendingList.slice(0, maxChecks)

    for (const tx of toCheck) {
      const updated = await syncTransactionWithGateway(tx)
      if (updated) gatewayUpdatedCount++
    }
  }

  return { expiredCount, gatewayUpdatedCount }
}

export default syncOrExpirePendingTransactions
