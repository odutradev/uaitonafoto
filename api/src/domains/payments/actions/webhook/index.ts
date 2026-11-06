import env from '@config/env'
import defineAction from '@factories/defineAction'
import isValidWebhookSecret from './utils/isValidWebhookSecret'
import processWebhookEvent from './utils/processWebhookEvent'
import { webhookBodySchema, webhookQuerySchema, webhookResponseSchema } from './schemas'

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
      query: webhookQuerySchema,
      body: webhookBodySchema
    },
    responses: {
      200: { description: 'Evento recebido', schema: webhookResponseSchema },
      401: { description: 'Secret do webhook inválido' }
    }
  },
  async ({ query, data, defaultExpress, manageError }: ManageRequestBody<WebhookRequest>): ManageRequestResponse<WebhookResponse> => {
    if (!isValidWebhookSecret(query.webhookSecret, env.ABACATEPAY_WEBHOOK_SECRET)) {
      return manageError({ code: 'unauthorized' })
    }

    const deliveryHeader = defaultExpress.req.headers['webhook-id']

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
