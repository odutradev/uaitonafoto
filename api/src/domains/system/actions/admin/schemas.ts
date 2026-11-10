import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

import { createPaginatedSchema, paginationQuerySchema } from '@factories/pagination/schemas'

extendZodWithOpenApi(z)

export const adminPeriodSchema = z
  .enum(['7d', '30d', '90d', '6m', '12m', 'all'])
  .default('30d')
  .openapi({ example: '30d', description: 'Período de análise das métricas' })

export const adminMetricsQuerySchema = z
  .object({
    period: adminPeriodSchema.optional()
  })
  .openapi('AdminMetricsQuery')

export const adminMetricsResponseSchema = z
  .object({
    period: adminPeriodSchema,
    periodSummary: z.object({
      newUsers: z.number().openapi({ example: 8 }),
      newEvents: z.number().openapi({ example: 5 }),
      photosUploaded: z.number().openapi({ example: 420 }),
      revenue: z.number().openapi({ example: 125000 }),
      paidTransactions: z.number().openapi({ example: 4 })
    }),
    users: z.object({
      total: z.number().openapi({ example: 42 }),
      admins: z.number().openapi({ example: 2 }),
      trialClaimed: z.number().openapi({ example: 15 }),
      totalPaidCredits: z.number().openapi({ example: 120 }),
      totalFreeCredits: z.number().openapi({ example: 35 })
    }),
    events: z.object({
      total: z.number().openapi({ example: 28 }),
      active: z.number().openapi({ example: 18 }),
      closed: z.number().openapi({ example: 10 }),
      totalPhotos: z.number().openapi({ example: 1420 }),
      avgPhotosPerEvent: z.number().openapi({ example: 51 })
    }),
    plans: z.object({
      activeSubscriptions: z.number().openapi({ example: 8 }),
      cancelledSubscriptions: z.number().openapi({ example: 2 }),
      totalRevenue: z.number().openapi({ example: 345000 }), // centavos
      totalTransactions: z.number().openapi({ example: 24 }),
      averageTicket: z.number().openapi({ example: 14375 }), // centavos
      distribution: z.array(
        z.object({
          name: z.string().openapi({ example: 'Plano Pro' }),
          count: z.number().openapi({ example: 5 })
        })
      )
    }),
    timeline: z.array(
      z.object({
        label: z.string().openapi({ example: 'Out/26' }),
        newUsers: z.number().openapi({ example: 12 }),
        newEvents: z.number().openapi({ example: 8 }),
        transactions: z.number().openapi({ example: 6 })
      })
    )
  })
  .openapi('AdminMetricsResponse')

export const adminUserItemSchema = z
  .object({
    id: z.string().openapi({ example: 'user-id-123' }),
    name: z.string().openapi({ example: 'João Silva' }),
    fullName: z.string().optional().openapi({ example: 'João Silva Eventos' }),
    email: z.string().openapi({ example: 'joao@example.com' }),
    phone: z.string().optional().openapi({ example: '31999999999' }),
    photoUrl: z.string().optional(),
    role: z.enum(['admin', 'user']).openapi({ example: 'user' }),
    freeCredits: z.number().openapi({ example: 1 }),
    paidCredits: z.number().openapi({ example: 5 }),
    hasActiveSubscription: z.boolean().openapi({ example: true }),
    planName: z.string().optional().openapi({ example: 'Plano Pro Mensal' }),
    freeTrialClaimedAt: z.string().optional(),
    createdAt: z.string().openapi({ example: '2026-10-01T12:00:00.000Z' }),
    updatedAt: z.string().openapi({ example: '2026-11-01T12:00:00.000Z' })
  })
  .openapi('AdminUserItem')

export const listAdminUsersQuerySchema = z
  .object({
    search: z.string().max(100).optional().openapi({
      param: { description: 'Busca por nome ou e-mail do usuário' }
    }),
    role: z.enum(['admin', 'user']).optional().openapi({
      param: { description: 'Filtrar por papel' }
    })
  })
  .merge(paginationQuerySchema)
  .openapi('ListAdminUsersQuery')

export const listAdminUsersResponseSchema = createPaginatedSchema(
  adminUserItemSchema,
  'ListAdminUsersResponse'
)

export const addAdminUserCreditsParamsSchema = z.object({
  userId: z.string().min(1).openapi({
    param: { description: 'ID do usuário para adicionar créditos' }
  })
})

export const addAdminUserCreditsBodySchema = z
  .object({
    amount: z.number().int().min(1).max(1000).openapi({ example: 5 }),
    type: z.enum(['paid', 'free']).default('paid').openapi({ example: 'paid' }),
    reason: z.string().max(250).optional().openapi({ example: 'Bonificação concedida pelo suporte' })
  })
  .openapi('AddAdminUserCreditsBody')

export const addAdminUserCreditsResponseSchema = z
  .object({
    user: adminUserItemSchema,
    message: z.string().openapi({ example: 'Créditos adicionados com sucesso.' })
  })
  .openapi('AddAdminUserCreditsResponse')

