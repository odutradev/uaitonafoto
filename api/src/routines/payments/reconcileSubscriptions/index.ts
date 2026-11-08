import { defineRoutine } from '@config/routine'
import { getPaymentClient } from '@payment'
import createLogger from '@utils/logger'
import transactionRepository from '@domains/payments/repositories/transactions'
import subscriptionRepository from '@domains/payments/repositories/subscriptions'
import confirmPayment from '@domains/payments/actions/webhook/utils/confirmPayment'
import ensureSubscriptionRecord from '@domains/payments/utils/ensureSubscriptionRecord'
import grantSubscriptionRenewal from '@domains/payments/utils/grantSubscriptionRenewal'

import type { AbacatePayClient } from '@payment/types'
import type { ConfirmedStatementCharge } from './types'

const logger = createLogger('payments:routine')

const MIN_RENEWAL_GAP_MS = 24 * 60 * 60 * 1000

const fetchConfirmedStatementCharges = async (client: AbacatePayClient): Promise<ConfirmedStatementCharge[]> => {
  const response = await client.bankStatement.list({ limit: 100 })
  if (response.error || !response.data) return []

  const refundedIntentIds = new Set<string>()

  for (const item of response.data) {
    const hasReversal = item.movements.some((m) => m.category === 'refund' || m.category === 'reversal')
    if (hasReversal && item.paymentIntentId) {
      refundedIntentIds.add(item.paymentIntentId)
    }
  }

  const charges: ConfirmedStatementCharge[] = []

  for (const item of response.data) {
    if (!item.checkoutId || !item.paymentIntentId) continue
    if (refundedIntentIds.has(item.paymentIntentId)) continue

    const creditMovement = item.movements.find(
      (m) => m.category === 'transaction' && m.balanceEffect === 'credit'
    )
    if (!creditMovement) continue

    charges.push({
      checkoutId: item.checkoutId,
      paymentIntentId: item.paymentIntentId,
      amount: creditMovement.amount,
      createdAt: item.createdAt
    })
  }

  return charges.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

const syncPendingSubscriptionTransactions = async (client: AbacatePayClient): Promise<void> => {
  const transactions = await transactionRepository.listSubscriptionTransactionsToSync()

  for (const tx of transactions) {
    try {
      const subRes = await client.subscriptions.get({ externalId: tx.id })
      if (subRes.error || !subRes.data) continue

      const gatewaySub = subRes.data

      if (tx.status === 'PENDING' && gatewaySub.status === 'ACTIVE') {
        await confirmPayment(tx, {
          subscription: {
            id: gatewaySub.id,
            amount: gatewaySub.amount,
            method: gatewaySub.method,
            status: gatewaySub.status
          }
        })
      } else if (tx.status === 'PAID') {
        await ensureSubscriptionRecord(tx, {
          id: gatewaySub.id,
          method: gatewaySub.method
        })
      }
    } catch (error) {
      logger.warn(`Failed to reconcile subscription transaction ${tx.id}:`, error)
    }
  }
}

export const runSubscriptionReconciliation = async (): Promise<void> => {
  const client = await getPaymentClient()

  await syncPendingSubscriptionTransactions(client)

  const subscriptions = await subscriptionRepository.listActiveOrPastDue()
  if (subscriptions.length === 0) return

  const statementCharges = await fetchConfirmedStatementCharges(client)

  for (const sub of subscriptions) {
    try {
      const subRes = await client.subscriptions.get({ id: sub.subscriptionId })

      if (!subRes.error && subRes.data?.status === 'CANCELLED') {
        await subscriptionRepository.updateStatus(sub.id, {
          status: 'CANCELLED',
          cancelledAt: new Date().toISOString(),
          cancelReason: 'cancelled_by_gateway'
        })
        continue
      }

      if (!sub.checkoutId) continue

      const subCharges = statementCharges.filter((charge) => charge.checkoutId === sub.checkoutId)
      if (subCharges.length <= sub.cyclesCompleted) continue

      const initialCreatedTime = new Date(sub.createdAt).getTime()
      const renewalCharges = subCharges
        .slice(1)
        .filter((charge) => new Date(charge.createdAt).getTime() - initialCreatedTime >= MIN_RENEWAL_GAP_MS)

      for (const charge of renewalCharges) {
        await grantSubscriptionRenewal({
          subscription: sub,
          externalPaymentId: charge.paymentIntentId,
          paidAt: charge.createdAt,
          amount: charge.amount,
          paidAmount: charge.amount
        })
      }
    } catch (error) {
      logger.warn(`Failed to reconcile subscription ${sub.subscriptionId}:`, error)
    }
  }
}

export const reconcileSubscriptionsRoutine = defineRoutine({
  name: 'reconcileSubscriptions',
  description: 'Reconcile recurring subscriptions against bank statements and gateway status',
  cronExpression: '0 * * * *',
  runOnInit: true,
  handler: runSubscriptionReconciliation
})

export default reconcileSubscriptionsRoutine

