import { getPlanByProductId } from '@payment/plans'
import defineAction from '@factories/defineAction'
import { authRateLimiter } from '@middlewares/rateLimit'
import userRepository from '@domains/users/repositories'
import resolveFrontendBaseUrl from '@domains/users/utils/resolveFrontendBaseUrl'
import transactionRepository from '../../repositories/transactions'
import createGatewayCheckout from './utils/createGatewayCheckout'
import { checkoutResponseSchema, createCheckoutBodySchema } from './schemas'

import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type { CheckoutResponse, CreateCheckoutRequest } from './types'

export const createCheckout = defineAction(
  {
    method: 'post',
    path: '/payments/checkout',
    summary: 'Criar checkout do AbacatePay para um plano ou produto',
    tags: ['Pagamentos'],
    authenticate: true,
    middlewares: [authRateLimiter],
    responses: {
      200: { description: 'URL de checkout criada', schema: checkoutResponseSchema },
      404: { description: 'Plano não encontrado' }
    }
  },
  async ({ ids, data, defaultExpress, manageError }: ManageRequestBody<CreateCheckoutRequest>): ManageRequestResponse<CheckoutResponse> => {
    if (!ids.userId) return manageError({ code: 'unauthorized' })

    const user = await userRepository.findById(ids.userId)
    if (!user) return manageError({ code: 'user_not_found' })

    const plan = getPlanByProductId(data.planId)
    if (!plan) return manageError({ code: 'not_found' })

    if (plan.type === 'FREE' || plan.price <= 0) return manageError({ code: 'bad_request' })

    const { req } = defaultExpress
    const baseUrl = resolveFrontendBaseUrl(undefined, req.headers.origin)

    const transaction = await transactionRepository.create({
      userId: user.id,
      userEmail: user.email,
      userName: user.fullName || user.name,
      planId: plan.id,
      planType: plan.type,
      planName: plan.name,
      planSnapshot: plan,
      quantity: 1,
      amount: plan.price,
      currency: plan.currency,
      gateway: 'abacatepay',
      methods: [],
      devMode: Boolean(plan.devMode),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    const returnUrl = `${baseUrl}/app?payment=cancelled&plan=${plan.id}`
    const completionUrl = `${baseUrl}/app?payment=success&transaction=${transaction.id}`

    try {
      const { customerId, checkout } = await createGatewayCheckout({
        plan,
        user,
        transactionId: transaction.id,
        returnUrl,
        completionUrl
      })

      await transactionRepository.update(transaction.id, {
        customerId,
        checkoutId: checkout.id,
        checkoutUrl: checkout.url,
        methods: checkout.methods,
        devMode: checkout.devMode,
        returnUrl,
        completionUrl,
        gatewayResponse: checkout.raw
      })

      return { transactionId: transaction.id, checkoutId: checkout.id, checkoutUrl: checkout.url }
    } catch (error) {
      await transactionRepository.update(transaction.id, { status: 'CANCELLED' })
      return manageError({ code: 'internal_error', error })
    }
  },
  { body: createCheckoutBodySchema }
)
