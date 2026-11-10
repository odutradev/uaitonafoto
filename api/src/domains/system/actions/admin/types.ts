import type { z } from 'zod'
import type {
  addAdminUserCreditsBodySchema,
  addAdminUserCreditsParamsSchema,
  addAdminUserCreditsResponseSchema,
  adminMetricsQuerySchema,
  adminMetricsResponseSchema,
  adminPeriodSchema,
  adminUserItemSchema,
  listAdminUsersQuerySchema,
  listAdminUsersResponseSchema
} from './schemas'

export type AdminPeriod = z.infer<typeof adminPeriodSchema>
export type AdminMetricsQuery = z.infer<typeof adminMetricsQuerySchema>
export type AdminMetricsResponse = z.infer<typeof adminMetricsResponseSchema>

export type AdminUserItem = z.infer<typeof adminUserItemSchema>

export type ListAdminUsersQuery = z.infer<typeof listAdminUsersQuerySchema>
export type ListAdminUsersResponse = z.infer<typeof listAdminUsersResponseSchema>

export type AddAdminUserCreditsParams = z.infer<typeof addAdminUserCreditsParamsSchema>
export type AddAdminUserCreditsBody = z.infer<typeof addAdminUserCreditsBodySchema>
export type AddAdminUserCreditsResponse = z.infer<typeof addAdminUserCreditsResponseSchema>

