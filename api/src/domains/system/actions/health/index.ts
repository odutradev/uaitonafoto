import { healthCheckResponseSchema } from './schemas'
import defineAction from '@factories/defineAction'
import { checkDatabaseHealth } from '@database'
import { checkFirebaseHealth } from '@firebase'
import { getAppVersion } from '@config/version'
import { checkPaymentHealth } from '@payment'
import { checkEmailHealth } from '@email'
import env from '@config/env'

import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type { HealthCheckResponse } from './types'

export const healthCheck = defineAction(
  {
    method: 'get',
    path: '/health',
    summary: 'Verificar status e saúde dos serviços da API',
    tags: ['Sistema'],
    authenticate: false,
    responses: {
      200: { description: 'Serviços operacionais', schema: healthCheckResponseSchema },
      503: { description: 'Serviço degradado', schema: healthCheckResponseSchema }
    }
  },
  async ({ defaultExpress }: ManageRequestBody): ManageRequestResponse<HealthCheckResponse> => {
    const services = {
      database: checkDatabaseHealth(),
      firebase: checkFirebaseHealth(),
      email: checkEmailHealth(),
      payment: checkPaymentHealth()
    }

    const isHealthy = services.database === 'ok' && services.firebase === 'ok'
    const status = isHealthy ? 'ok' : 'degraded'

    const payload: HealthCheckResponse = {
      status,
      mode: env.NODE_ENV,
      version: getAppVersion(),
      services
    }

    if (!isHealthy) {
      defaultExpress.res.status(503).json(payload)
      return payload
    }

    return payload
  }
)

export default healthCheck
