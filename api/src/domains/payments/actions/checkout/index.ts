import env from '@config/env'
import { PaymentMethod } from '@abacatepay/types/v2'
import { getPaymentClient } from '@payment'
import { getPlanByProductId } from '@payment/plans'
import defineAction from '@factories/defineAction'
import logRepository from '@domains/system/repositories'
import userRepository from '@domains/users/repositories'
import subscriptionRepository from '../../repositories/subscriptions'
import transactionRepository from '../../repositories/transactions'
import { checkoutResponseSchema, createCheckoutBodySchema } from './schemas'

import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type { CheckoutResponse, CreateCheckoutRequest, GatewayCheckoutParams, GatewayCheckoutResult } from './types'

const createGatewayCheckout = async ({
  plan,
  user,
  transactionId,
  returnUrl,
  completionUrl
}: GatewayCheckoutParams): Promise<GatewayCheckoutResult> => {
  const client = await getPaymentClient()

  const customerResponse = await client.customers.create({
    email: user.email,
    name: user.fullName || user.name
  })

  if (customerResponse.error || !customerResponse.data) {
    throw new Error(`Failed to create AbacatePay customer: ${customerResponse.error}`)
  }

  const customerId = customerResponse.data.id

  const isPixOnly = env.ABACATEPAY_PIX_ONLY === 'true'

  const body = {
    items: [{ id: plan.abacateProductId, quantity: 1 }],
    customerId,
    externalId: transactionId,
    returnUrl,
    completionUrl,
    metadata: { transactionId, userId: user.id, planId: plan.id },
    ...(isPixOnly ? { methods: [PaymentMethod.Pix] } : {})
  }

  const checkoutResponse =
    plan.type === 'SUBSCRIPTION'
      ? await client.subscriptions.create(body)
      : await client.checkouts.create(body)

  if (checkoutResponse.error || !checkoutResponse.data) {
    throw new Error(`Failed to create AbacatePay checkout: ${checkoutResponse.error}`)
  }

  const { id, url, methods, devMode } = checkoutResponse.data

  return {
    customerId,
    checkout: { id, url, methods: methods ?? [], devMode: Boolean(devMode), raw: checkoutResponse.data }
  }
}

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
    const baseUrl = (req.headers.origin as string | undefined)?.replace(/\/+$/, '') || env.FRONTEND_URL.replace(/\/+$/, '')

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
