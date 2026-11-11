import type { planSchema, plansListResponseSchema, getPlanParamsSchema, getPlansQuerySchema } from './schemas'
import type { z } from 'zod'

export type PlanResponse = z.infer<typeof planSchema>
export type PlansListResponse = z.infer<typeof plansListResponseSchema>
export type GetPlanParams = z.infer<typeof getPlanParamsSchema>
export type GetPlansQuery = z.infer<typeof getPlansQuerySchema>

export interface ListPlansSchema {
  query?: GetPlansQuery
}

export interface GetPlanSchema {
  params: GetPlanParams
}
