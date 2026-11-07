import { getPaymentClient } from '@payment'

export const cancelGatewaySubscription = async (subscriptionId: string): Promise<void> => {
  const client = await getPaymentClient()
  const response = await client.subscriptions.cancel(subscriptionId)

  if (!response.error) return

  const checkResponse = await client.subscriptions.get({ id: subscriptionId })
  if (!checkResponse.error && checkResponse.data?.status === 'CANCELLED') {
    return
  }

  throw new Error(`Failed to cancel AbacatePay subscription ${subscriptionId}: ${response.error}`)
}

export default cancelGatewaySubscription
