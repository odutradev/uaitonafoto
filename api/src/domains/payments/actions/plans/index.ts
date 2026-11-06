import { getCachedPlans, getPlanByProductId } from '@payment'
import defineAction from '@factories/defineAction'
import { planSchema, plansListResponseSchema, getPlanParamsSchema, getPlansQuerySchema } from './schemas'

import type { ManageRequestBody, ManageRequestResponse } from '@middlewares/manageRequest/types'
import type { GetPlanSchema, ListPlansSchema, PlanResponse, PlansListResponse } from './types'

export const listPlans = defineAction(
  {
    method: 'get',
    path: '/plans',
    summary: 'Listar planos disponíveis ou buscar por query',
    tags: ['Pagamentos'],
    authenticate: false,
    schema: {
      query: getPlansQuerySchema
    },
    responses: {
      200: { description: 'Lista de planos em cache', schema: plansListResponseSchema }
    }
  },
  async ({ query }: ManageRequestBody<ListPlansSchema>): ManageRequestResponse<PlansListResponse> => {
    const plans = getCachedPlans()

    if (query?.id) {
      const single = getPlanByProductId(query.id)
      return single ? [single] : []
    }

    return plans
  }
)

export const getPlanById = defineAction(
  {
    method: 'get',
    path: '/plans/:id',
    summary: 'Buscar dados de um plano específico por ID ou identificador',
    tags: ['Pagamentos'],
    authenticate: false,
    schema: {
      params: getPlanParamsSchema
    },
    responses: {
      200: { description: 'Dados do plano encontrado', schema: planSchema },
      404: { description: 'Plano não encontrado' }
    }
  },
  async ({ params, manageError }: ManageRequestBody<GetPlanSchema>): ManageRequestResponse<PlanResponse> => {
    const plan = getPlanByProductId(params.id)

    if (!plan) {
      return manageError({ code: 'not_found' })
    }

    return plan
  }
)

export * from './types'
export * from './schemas'

