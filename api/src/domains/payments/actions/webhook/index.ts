import env from '@config/env'
import defineAction from '@factories/defineAction'
import verifyWebhookRequest from './utils/verifyWebhookRequest'
import processWebhookEvent from './utils/processWebhookEvent'
import { webhookBodySchema, webhookResponseSchema } from './schemas'

import type { RawBodyRequest } from '@middlewares/rawBody/types'
import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type { WebhookEventData, WebhookRequest, WebhookResponse } from './types'

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

