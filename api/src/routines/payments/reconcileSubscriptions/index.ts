import ensureSubscriptionRecord from '@domains/payments/utils/ensureSubscriptionRecord'
import grantSubscriptionRenewal from '@domains/payments/utils/grantSubscriptionRenewal'
import subscriptionRepository from '@domains/payments/repositories/subscriptions'
import transactionRepository from '@domains/payments/repositories/transactions'
import confirmPayment from '@domains/payments/utils/confirmPayment'
import logRepository from '@domains/system/repositories/logs'
import { defineRoutine } from '@config/routine'
import { getPaymentClient } from '@payment'
import runSequentially from '@utils/async'
import createLogger from '@utils/logger'

import type { ConfirmedStatementCharge } from './types'
import type { AbacatePayClient } from '@payment/types'

const logger = createLogger('payments:routine')

const MinRenewalGapMs = 24 * 60 * 60 * 1000

const toErrorMessage = (error: unknown): string => (error instanceof Error ? error.message : String(error))

const recordReconciliationFailure = (title: string, description: string, error: unknown, targetId?: string): void => {
  void logRepository.create({
    category: 'system',
    level: 'error',
    action: 'SUBSCRIPTION_RECONCILE_FAILED',
    title,
    description,
    targetId,
    errorMessage: toErrorMessage(error),
    errorStack: error instanceof Error ? error.stack : undefined
  })
}

const fetchConfirmedStatementCharges = async (client: AbacatePayClient): Promise<ConfirmedStatementCharge[]> => {
  const response = await client.bankStatement.list({ limit: 100 })
  if (response.error || !response.data) return []

  const refundedIntentIds = new Set(
    response.data
      .filter((item) => item.movements.some((movement) => movement.category === 'refund' || movement.category === 'reversal'))
      .map((item) => item.paymentIntentId)
      .filter((paymentIntentId): paymentIntentId is string => Boolean(paymentIntentId))
  )

  const charges = response.data.flatMap((item): ConfirmedStatementCharge[] => {
    if (!item.checkoutId || !item.paymentIntentId) return []
    if (refundedIntentIds.has(item.paymentIntentId)) return []

    const creditMovement = item.movements.find(
      (movement) => movement.category === 'transaction' && movement.balanceEffect === 'credit'
    )
    if (!creditMovement) return []

    return [
      {
        checkoutId: item.checkoutId,
        paymentIntentId: item.paymentIntentId,
        amount: creditMovement.amount,
        createdAt: item.createdAt
      }
    ]
  })

  return charges.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

const syncPendingSubscriptionTransactions = async (client: AbacatePayClient): Promise<void> => {
  const transactions = await transactionRepository.listSubscriptionTransactionsToSync()

  await runSequentially(transactions, async (tx) => {
    try {
      const subRes = await client.subscriptions.get({ externalId: tx.id })
      if (subRes.error || !subRes.data) return

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
        return
      }

      if (tx.status === 'PAID') {
        await ensureSubscriptionRecord(tx, {
          id: gatewaySub.id,
          method: gatewaySub.method
        })
      }
    } catch (error) {
      logger.warn(`Failed to reconcile subscription transaction ${tx.id}:`, error)
      recordReconciliationFailure(
        'Falha na reconciliação de assinaturas',
        `Não foi possível sincronizar a transação de assinatura ${tx.id} com o gateway.`,
        error,
        tx.id
      )
    }
  })
}

const reconcileAllSubscriptions = async (): Promise<void> => {
  const client = await getPaymentClient()

  await syncPendingSubscriptionTransactions(client)

  const subscriptions = await subscriptionRepository.listActiveOrPastDue()
  if (subscriptions.length === 0) return

  const statementCharges = await fetchConfirmedStatementCharges(client)

  await runSequentially(subscriptions, async (sub) => {
    try {
      const subRes = await client.subscriptions.get({ id: sub.subscriptionId })

      if (!subRes.error && subRes.data?.status === 'CANCELLED') {
        await subscriptionRepository.updateStatus(sub.id, {
          status: 'CANCELLED',
          cancelledAt: new Date().toISOString(),
          cancelReason: 'cancelled_by_gateway'
        })
        return
      }

      if (!sub.checkoutId) return

      const subCharges = statementCharges.filter((charge) => charge.checkoutId === sub.checkoutId)
      if (subCharges.length <= sub.cyclesCompleted) return

      const initialCreatedTime = new Date(sub.createdAt).getTime()
      const renewalCharges = subCharges
        .slice(1)
        .filter((charge) => new Date(charge.createdAt).getTime() - initialCreatedTime >= MinRenewalGapMs)

      await runSequentially(renewalCharges, (charge) =>
        grantSubscriptionRenewal({
          subscription: sub,
          externalPaymentId: charge.paymentIntentId,
          paidAt: charge.createdAt,
          amount: charge.amount,
          paidAmount: charge.amount
        })
      )
    } catch (error) {
      logger.warn(`Failed to reconcile subscription ${sub.subscriptionId}:`, error)
      recordReconciliationFailure(
        'Falha na reconciliação de assinaturas',
        `Não foi possível reconciliar a assinatura ${sub.planName} (${sub.subscriptionId}).`,
        error,
        sub.subscriptionId
      )
    }
  })
}

export const runSubscriptionReconciliation = async (): Promise<void> => {
  try {
    await reconcileAllSubscriptions()
  } catch (error) {
    recordReconciliationFailure(
      'Rotina de reconciliação de assinaturas falhou',
      'A rotina de reconciliação parou antes de terminar. Renovações e cancelamentos podem não ter sido processados.',
      error
    )
    throw error
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

