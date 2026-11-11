import { verifyStandardWebhookSignature, verifyWebhookSignature } from '@abacatepay/types'

import { sendSubscriptionPaymentFailedEmail } from '@domains/payments/utils/notifySubscriptionEmail'
import ensureSubscriptionRecord from '@domains/payments/utils/ensureSubscriptionRecord'
import grantSubscriptionRenewal from '@domains/payments/utils/grantSubscriptionRenewal'
import subscriptionRepository from '@domains/payments/repositories/subscriptions'
import transactionRepository from '@domains/payments/repositories/transactions'
import { webhookBodySchema, webhookResponseSchema } from './schemas'
import confirmPayment from '@domains/payments/utils/confirmPayment'
import userRepository from '@domains/users/repositories'
import logRepository from '@domains/system/repositories'
import defineAction from '@factories/defineAction'
import env from '@config/env'

import type { TransactionEntity, TransactionStatus, TransactionWebhookEvent } from '@domains/payments/repositories/transactions/types'
import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type { SubscriptionEntity } from '@domains/payments/repositories/subscriptions/types'
import type { WebhookEventData, WebhookRequest, WebhookResponse } from './types'
import type { RawBodyRequest } from '@middlewares/rawBody/types'
import type { IncomingHttpHeaders } from 'http'

const statusByEvent: Record<string, TransactionStatus> = {
  'checkout.refunded': 'REFUNDED',
  'checkout.disputed': 'DISPUTED',
  'checkout.expired': 'EXPIRED',
  'checkout.cancelled': 'CANCELLED'
}

const completionEvents = ['checkout.completed', 'subscription.completed']
const subscriptionLifecycleEvents = [
  'subscription.renewed',
  'subscription.cancelled',
  'subscription.payment_failed'
]

const readHeader = (headers: IncomingHttpHeaders, name: string): string | undefined => {
  const value = headers[name]
  return Array.isArray(value) ? value[0] : value
}

const verifyWebhookRequest = (rawBody: string | undefined, headers: IncomingHttpHeaders, secret: string): boolean => {
  if (!rawBody) return false

  const standardSignature = readHeader(headers, 'webhook-signature')

  if (standardSignature) {
    const id = readHeader(headers, 'webhook-id')
    const timestamp = readHeader(headers, 'webhook-timestamp')

    if (!id || !timestamp) return false

    return verifyStandardWebhookSignature(rawBody, { id, timestamp, signature: standardSignature }, secret)
  }

  const legacySignature = readHeader(headers, 'x-webhook-signature')

  return legacySignature ? verifyWebhookSignature(rawBody, legacySignature) : false
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

interface HandleSubscriptionWebhookParams {
  event: string
  deliveryId?: string
  data: WebhookEventData
  webhookEvent: TransactionWebhookEvent
}

const handleSubscriptionWebhook = async ({
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

    const cancelReason = data.subscription?.cancelledDueTo ?? 'cancelled_by_gateway'

    await subscriptionRepository.updateStatus(subscription.id, {
      status: 'CANCELLED',
      cancelledAt: data.subscription?.canceledAt ?? new Date().toISOString(),
      cancelReason
    })

    const user = await userRepository.findById(subscription.userId)
    const initialTx = user ? null : await transactionRepository.findById(subscription.initialTransactionId)
    const userEmail = user?.email ?? initialTx?.userEmail ?? 'unknown@user'
    const userName = user?.fullName || user?.name || initialTx?.userName || 'Usuário'

    await transactionRepository.createCancelled({
      userId: subscription.userId,
      userEmail,
      userName,
      planId: subscription.planId,
      planType: 'SUBSCRIPTION',
      planName: subscription.planName,
      planSnapshot: subscription.planSnapshot,
      quantity: 1,
      amount: subscription.amount,
      currency: subscription.currency,
      cancelReason,
      gateway: 'abacatepay',
      subscriptionId: subscription.subscriptionId,
      checkoutId: subscription.checkoutId,
      customerId: subscription.customerId,
      paymentMethod: subscription.method,
      methods: subscription.method ? [subscription.method] : [],
      devMode: false
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

interface ProcessWebhookParams {
  event: string
  deliveryId?: string
  devMode?: boolean
  data: WebhookEventData
  payload: unknown
}

const processWebhookEvent = async ({ event, deliveryId, devMode, data, payload }: ProcessWebhookParams): Promise<void> => {
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
  if (status) {
    const cancelReason =
      status === 'EXPIRED'
        ? 'checkout_expired'
        : status === 'CANCELLED'
          ? 'checkout_cancelled'
          : undefined
    await transactionRepository.update(transaction.id, { status, cancelReason })
  }
}

export const paymentWebhook = defineAction(
  {
    method: 'post',
    path: '/payments/webhook',
    summary: 'Receber eventos de pagamento do AbacatePay',
    tags: ['Pagamentos'],
    authenticate: false,
    schema: {
      body: webhookBodySchema
    },
    responses: {
      200: { description: 'Evento recebido', schema: webhookResponseSchema },
      401: { description: 'Assinatura do webhook inválida' }
    }
  },
  async ({ data, defaultExpress, manageError }: ManageRequestBody<WebhookRequest>): ManageRequestResponse<WebhookResponse> => {
    const { headers, rawBody } = defaultExpress.req as RawBodyRequest

    if (!verifyWebhookRequest(rawBody, headers, env.ABACATEPAY_WEBHOOK_SECRET)) {
      return manageError({ code: 'unauthorized' })
    }

    const deliveryHeader = headers['webhook-id']

    await processWebhookEvent({
      event: data.event ?? data.type ?? 'unknown',
      deliveryId: data.id ?? (typeof deliveryHeader === 'string' ? deliveryHeader : undefined),
      devMode: data.devMode,
      data: data.data as WebhookEventData,
      payload: data
    })

    return { received: true }
  }
)
