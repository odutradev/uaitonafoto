import transactionRepository from '../../../repositories/transactions'
import confirmPayment from './confirmPayment'
import handleSubscriptionWebhook from './handleSubscriptionWebhook'

import type { TransactionStatus, TransactionWebhookEvent } from '../../../repositories/transactions/types'
import type { WebhookEventData } from '../types'

const statusByEvent: Record<string, TransactionStatus> = {
  'checkout.refunded': 'REFUNDED',
  'checkout.disputed': 'DISPUTED'
}

const completionEvents = ['checkout.completed', 'subscription.completed']
const subscriptionLifecycleEvents = [
  'subscription.renewed',
  'subscription.cancelled',
  'subscription.payment_failed'
]

interface ProcessWebhookParams {
  event: string
  deliveryId?: string
  devMode?: boolean
  data: WebhookEventData
  payload: unknown
}

export const processWebhookEvent = async ({ event, deliveryId, devMode, data, payload }: ProcessWebhookParams): Promise<void> => {
  const webhookEvent: TransactionWebhookEvent = {
    deliveryId,
    event,
    devMode,
    receivedAt: new Date().toISOString(),
    payload
  }

  if (subscriptionLifecycleEvents.includes(event)) {
    await handleSubscriptionWebhook({ event, deliveryId, data, webhookEvent })
    return
  }

  const checkout = data.checkout
  const subscriptionId = data.subscription?.id
  if (!checkout?.id && !checkout?.externalId && !subscriptionId) return

  const transaction =
    (checkout?.externalId ? await transactionRepository.findById(checkout.externalId) : null) ??
    (checkout?.id ? await transactionRepository.findByCheckoutId(checkout.id) : null) ??
    (subscriptionId ? await transactionRepository.findBySubscriptionId(subscriptionId) : null)

  if (!transaction) return

  await transactionRepository.appendWebhookEvent(transaction.id, webhookEvent)

  if (completionEvents.includes(event)) {
    await confirmPayment(transaction, data)
    return
  }

  const status = statusByEvent[event]
  if (status) await transactionRepository.update(transaction.id, { status })
}

export default processWebhookEvent
