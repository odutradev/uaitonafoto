import logRepository from '@domains/system/repositories'
import transactionRepository from '../../../repositories/transactions'
import subscriptionRepository from '../../../repositories/subscriptions'
import ensureSubscriptionRecord from '../../../utils/ensureSubscriptionRecord'
import grantSubscriptionRenewal from '../../../utils/grantSubscriptionRenewal'
import { sendSubscriptionPaymentFailedEmail } from '../../../utils/notifySubscriptionEmail'

import type { SubscriptionEntity } from '../../../repositories/subscriptions/types'
import type { TransactionWebhookEvent } from '../../../repositories/transactions/types'
import type { WebhookEventData } from '../types'

interface HandleSubscriptionWebhookParams {
  event: string
  deliveryId?: string
  data: WebhookEventData
  webhookEvent: TransactionWebhookEvent
}

const resolveSubscription = async (data: WebhookEventData): Promise<SubscriptionEntity | null> => {
  const gatewaySub = data.subscription
  if (gatewaySub?.id) {
    const existing = await subscriptionRepository.findBySubscriptionId(gatewaySub.id)
    if (existing) return existing
  }

  const checkout = data.checkout
  const initialTx =
    (checkout?.externalId ? await transactionRepository.findById(checkout.externalId) : null) ??
    (checkout?.id ? await transactionRepository.findByCheckoutId(checkout.id) : null) ??
    (gatewaySub?.id ? await transactionRepository.findBySubscriptionId(gatewaySub.id) : null)

  if (!initialTx) return null

  return ensureSubscriptionRecord(initialTx, gatewaySub)
}

export const handleSubscriptionWebhook = async ({
  event,
  deliveryId,
  data,
  webhookEvent
}: HandleSubscriptionWebhookParams): Promise<void> => {
  const subscription = await resolveSubscription(data)
  if (!subscription) return

  if (event === 'subscription.renewed') {
    const externalPaymentId = data.payment?.id ?? (deliveryId ? `delivery:${deliveryId}` : undefined)
    if (!externalPaymentId) return

    await grantSubscriptionRenewal({
      subscription,
      externalPaymentId,
      paidAt: data.payment?.createdAt,
      amount: data.payment?.amount ?? data.subscription?.amount,
      paidAmount: data.payment?.paidAmount ?? undefined,
      platformFee: data.payment?.platformFee,
      receiptUrl: data.payment?.receiptUrl ?? undefined,
      paymentMethod: data.payerInformation?.method ?? data.subscription?.method,
      payerInformation: data.payerInformation,
      frequency: data.subscription?.frequency,
      webhookEvent
    })
    return
  }

  const initialTx = deliveryId
    ? await transactionRepository.findById(subscription.initialTransactionId)
    : null
  const isDuplicateDelivery = Boolean(
    deliveryId && initialTx?.webhookEvents.some((item) => item.deliveryId === deliveryId)
  )

  await transactionRepository.appendWebhookEvent(subscription.initialTransactionId, webhookEvent)

  if (event === 'subscription.cancelled') {
    if (subscription.status === 'CANCELLED') return

    await subscriptionRepository.updateStatus(subscription.id, {
      status: 'CANCELLED',
      cancelledAt: data.subscription?.canceledAt ?? new Date().toISOString(),
      cancelReason: data.subscription?.cancelledDueTo ?? 'cancelled_by_gateway'
    })

    logRepository.create({
      category: 'system',
      level: 'info',
      action: 'SUBSCRIPTION_CANCELLED',
      title: 'Assinatura cancelada',
      description: `Assinatura ${subscription.planName} (${subscription.subscriptionId}) encerrada`,
      userId: subscription.userId,
      targetId: subscription.subscriptionId,
      targetName: subscription.planName
    })
    return
  }

  if (event === 'subscription.payment_failed' && !isDuplicateDelivery) {
    if (subscription.status === 'ACTIVE') {
      await subscriptionRepository.updateStatus(subscription.id, { status: 'PAST_DUE' })
    }

    await sendSubscriptionPaymentFailedEmail(
      subscription,
      data.payerInformation?.method ?? data.subscription?.method
    )

    logRepository.create({
      category: 'system',
      level: 'warn',
      action: 'SUBSCRIPTION_PAYMENT_FAILED',
      title: 'Falha na cobrança recorrente',
      description: `Tentativa de cobrança mensal falhou para ${subscription.planName}`,
      userId: subscription.userId,
      targetId: subscription.subscriptionId,
      targetName: subscription.planName
    })
  }
}

export default handleSubscriptionWebhook
