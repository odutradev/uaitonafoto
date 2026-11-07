import transactionRepository from '../../../repositories/transactions'
import confirmPayment from './confirmPayment'

import type { TransactionStatus } from '../../../repositories/transactions/types'
import type { WebhookEventData } from '../types'

const statusByEvent: Record<string, TransactionStatus> = {
  'checkout.refunded': 'REFUNDED',
  'checkout.disputed': 'DISPUTED'
}

const completionEvents = ['checkout.completed', 'subscription.completed']

interface ProcessWebhookParams {
  event: string
  deliveryId?: string
  devMode?: boolean
  data: WebhookEventData
  payload: unknown
}

export const processWebhookEvent = async ({ event, deliveryId, devMode, data, payload }: ProcessWebhookParams): Promise<void> => {
  const checkout = data.checkout
  if (!checkout?.id && !checkout?.externalId) return

  const transaction =
    (checkout.externalId ? await transactionRepository.findById(checkout.externalId) : null) ??
    (checkout.id ? await transactionRepository.findByCheckoutId(checkout.id) : null)

  if (!transaction) return

  await transactionRepository.appendWebhookEvent(transaction.id, {
    deliveryId,
    event,
    devMode,
    receivedAt: new Date().toISOString(),
    payload
  })

  if (completionEvents.includes(event)) {
    await confirmPayment(transaction, data)
    return
  }

  const status = statusByEvent[event]
  if (status) await transactionRepository.update(transaction.id, { status })
}

export default processWebhookEvent

