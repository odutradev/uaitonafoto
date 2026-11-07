import defineAction from '@factories/defineAction'
import { authRateLimiter } from '@middlewares/rateLimit'
import userRepository from '@domains/users/repositories'
import logRepository from '@domains/system/repositories'
import transactionRepository from '../../repositories/transactions'
import subscriptionRepository from '../../repositories/subscriptions'
import cancelGatewaySubscription from './utils/cancelGatewaySubscription'
import syncUserSubscriptions from './utils/syncUserSubscriptions'
import toSubscriptionResponse from './utils/toSubscriptionResponse'
import {
  cancelSubscriptionParamsSchema,
  subscriptionListResponseSchema,
  subscriptionSchema
} from './schemas'

import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type {
  CancelSubscriptionRequest,
  SubscriptionListResponse,
  SubscriptionResponse
} from './types'

export const listMySubscriptions = defineAction(
  {
    method: 'get',
    path: '/payments/subscriptions',
    summary: 'Listar assinaturas recorrentes do usuário autenticado',
    tags: ['Pagamentos'],
    authenticate: true,
    responses: {
      200: { description: 'Lista de assinaturas do usuário', schema: subscriptionListResponseSchema }
    }
  },
  async ({ ids, manageError }): ManageRequestResponse<SubscriptionListResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    await syncUserSubscriptions(ids.userId)

    const subscriptions = await subscriptionRepository.listByUser(ids.userId)
    return subscriptions.map(toSubscriptionResponse)
  }
)

export const cancelMySubscription = defineAction(
  {
    method: 'post',
    path: '/payments/subscriptions/:id/cancel',
    summary: 'Cancelar assinatura recorrente do usuário autenticado',
    tags: ['Pagamentos'],
    authenticate: true,
    middlewares: [authRateLimiter],
    schema: {
      params: cancelSubscriptionParamsSchema
    },
    responses: {
      200: { description: 'Assinatura cancelada com sucesso', schema: subscriptionSchema },
      403: { description: 'Acesso negado à assinatura' },
      404: { description: 'Assinatura não encontrada' },
      409: { description: 'Assinatura já se encontra cancelada' }
    }
  },
  async ({ ids, params, manageError }: ManageRequestBody<CancelSubscriptionRequest>): ManageRequestResponse<SubscriptionResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const subscription =
      (await subscriptionRepository.findById(params.id)) ??
      (await subscriptionRepository.findBySubscriptionId(params.id))

    if (!subscription) return manageError({ code: 'not_found' })
    if (subscription.userId !== ids.userId) return manageError({ code: 'forbidden' })
    if (subscription.status === 'CANCELLED') return manageError({ code: 'conflict' })

    try {
      await cancelGatewaySubscription(subscription.subscriptionId)

      const updated = await subscriptionRepository.updateStatus(subscription.id, {
        status: 'CANCELLED',
        cancelledAt: new Date().toISOString(),
        cancelReason: 'cancelled_by_user'
      })

      if (!updated) return manageError({ code: 'internal_error' })

      const user = await userRepository.findById(ids.userId)
      const userEmail = user?.email ?? 'unknown@user'
      const userName = user?.fullName || user?.name || 'Usuário'

      await transactionRepository.createCancelled({
        userId: ids.userId,
        userEmail,
        userName,
        planId: subscription.planId,
        planType: 'SUBSCRIPTION',
        planName: subscription.planName,
        planSnapshot: subscription.planSnapshot,
        quantity: 1,
        amount: subscription.amount,
        currency: subscription.currency,
        cancelReason: 'cancelled_by_user',
        gateway: 'abacatepay',
        subscriptionId: subscription.subscriptionId,
        checkoutId: subscription.checkoutId,
        customerId: subscription.customerId,
        paymentMethod: subscription.method,
        methods: subscription.method ? [subscription.method] : [],
        devMode: false
      })

      logRepository.create({
        category: 'user',
        level: 'info',
        action: 'SUBSCRIPTION_CANCELLED',
        title: 'Assinatura cancelada pelo usuário',
        description: `Usuário cancelou a recorrência do plano ${subscription.planName}`,
        userId: ids.userId,
        targetId: subscription.subscriptionId,
        targetName: subscription.planName
      })

      return toSubscriptionResponse(updated)
    } catch (error) {
      return manageError({ code: 'internal_error', error })
    }
  }
)
