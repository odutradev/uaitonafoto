import { getPlanByProductId } from '@payment/plans'
import defineAction from '@factories/defineAction'
import logRepository from '@domains/system/repositories'
import userRepository from '@domains/users/repositories'
import resolveFrontendBaseUrl from '@domains/users/utils/resolveFrontendBaseUrl'
import subscriptionRepository from '../../repositories/subscriptions'
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
    responses: {
      200: { description: 'URL de checkout criada', schema: checkoutResponseSchema },
      403: { description: 'Produto restrito a assinantes ativos' },
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

    if (plan.abacateProductId === 'prod_agency_extra_credit') {
      const userSubscriptions = await subscriptionRepository.listByUser(user.id)
      const hasActiveSubscription = userSubscriptions.some((sub) => sub.status === 'ACTIVE')

      if (!hasActiveSubscription) {
        return manageError({
          code: 'forbidden',
          details: 'O Crédito Extra Avulso com desconto é exclusivo para assinantes ativos dos planos Agência.'
        })
      }
    }

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

    const returnUrl = `${baseUrl}/app/billing?payment=cancelled&plan=${plan.id}`
    const completionUrl = `${baseUrl}/app/billing?payment=success&transaction=${transaction.id}`

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

      logRepository.create({
        category: 'user',
        level: 'info',
        action: 'CHECKOUT_CREATED',
        title: 'Checkout de pagamento iniciado',
        description: `${user.fullName || user.name} iniciou pagamento de ${plan.name}`,
        userId: user.id,
        userName: user.fullName || user.name,
        userEmail: user.email,
        targetId: transaction.id,
        targetName: plan.name,
        details: { planId: plan.id, planType: plan.type, amount: plan.price }
      })

      return { transactionId: transaction.id, checkoutId: checkout.id, checkoutUrl: checkout.url }
    } catch (error) {
      await transactionRepository.update(transaction.id, { status: 'CANCELLED' })
      return manageError({ code: 'internal_error', error })
    }
  },
  { body: createCheckoutBodySchema }
)
