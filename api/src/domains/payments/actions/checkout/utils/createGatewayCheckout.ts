import { getPaymentClient } from '@payment'

import type { GatewayCheckoutParams, GatewayCheckoutResult } from '../types'

export const createGatewayCheckout = async ({
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

  const body = {
    items: [{ id: plan.abacateProductId, quantity: 1 }],
    customerId,
    externalId: transactionId,
    returnUrl,
    completionUrl,
    metadata: { transactionId, userId: user.id, planId: plan.id }
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

export default createGatewayCheckout
