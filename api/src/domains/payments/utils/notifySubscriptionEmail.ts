import env from '@config/env'
import { checkEmailHealth } from '@email'
import { subscriptionRenewedTemplate } from '@email/templates/subscriptionRenewed'
import { subscriptionPaymentFailedTemplate } from '@email/templates/subscriptionPaymentFailed'
import { formatDateBR } from '@utils/date'
import createLogger from '@utils/logger'
import userRepository from '@domains/users/repositories'
import transactionRepository from '../repositories/transactions'

import type { SubscriptionEntity } from '../repositories/subscriptions/types'

const logger = createLogger('payments:email')

const formatAmountBrl = (amountInCents: number): string =>
  (amountInCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const resolveAppUrl = (): string => `${env.FRONTEND_URL.replace(/\/+$/, '')}/app`

const formatPaymentMethodLabel = (method?: string): string => {
  if (method === 'PIX') return 'PIX'
  if (method === 'CARD') return 'Cartão de crédito'
  return 'Cartão/PIX'
}

export interface SendRenewedEmailParams {
  userEmail: string
  userName: string
  planName: string
  amount: number
  creditsAdded: number
  nextBillingAt: string
}

export const sendSubscriptionRenewedEmail = async ({
  userEmail,
  userName,
  planName,
  amount,
  creditsAdded,
  nextBillingAt
}: SendRenewedEmailParams): Promise<void> => {
  if (checkEmailHealth() === 'disabled' || !userEmail.includes('@') || userEmail === 'unknown@user') {
    return
  }

  const result = await subscriptionRenewedTemplate.send({
    to: userEmail,
    variables: {
      userName,
      planName,
      amountFormatted: formatAmountBrl(amount),
      creditsAdded,
      nextBillingDate: formatDateBR(new Date(nextBillingAt)),
      appUrl: resolveAppUrl()
    }
  })

  if (!result.success) {
    logger.warn(`Failed to send subscription renewed email to ${userEmail}: ${result.error}`)
  }
}

export const sendSubscriptionPaymentFailedEmail = async (
  subscription: SubscriptionEntity,
  method?: string
): Promise<void> => {
  if (checkEmailHealth() === 'disabled') return

  const user = await userRepository.findById(subscription.userId)
  const initialTx = user ? null : await transactionRepository.findById(subscription.initialTransactionId)

  const userEmail = user?.email ?? initialTx?.userEmail
  if (!userEmail) return

  const userName = user?.fullName || user?.name || initialTx?.userName || 'Assinante'

  const result = await subscriptionPaymentFailedTemplate.send({
    to: userEmail,
    variables: {
      userName,
      planName: subscription.planName,
      amountFormatted: formatAmountBrl(subscription.amount),
      paymentMethodLabel: formatPaymentMethodLabel(method ?? subscription.method),
      appUrl: resolveAppUrl()
    }
  })

  if (!result.success) {
    logger.warn(`Failed to send subscription payment failed email to ${userEmail}: ${result.error}`)
  }
}
