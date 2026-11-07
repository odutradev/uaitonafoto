import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const planTypeSchema = z.enum(['ONE_TIME', 'SUBSCRIPTION', 'UPSELL', 'FREE']).openapi({
  description: 'Tipo de recorrência, cobrança ou adicional do produto',
  example: 'UPSELL'
})

export const planSchema = z
  .object({
    id: z.string().openapi({ example: 'prod_b2c_event_pass' }),
    abacateProductId: z.string().openapi({ example: 'prod_agency_essential' }),
    productId: z.string().optional().openapi({ example: 'prod_GesxhTHw1GkDDHHH5MmSyUSX' }),
    type: planTypeSchema,
    credits: z.number().openapi({ example: 4 }),
    extraStorageDays: z.number().optional().openapi({ example: 365 }),
    name: z.string().openapi({ example: 'Plano Agência Essencial' }),
    title: z.string().optional().openapi({ example: 'Agência Essencial' }),
    description: z.string().openapi({ example: 'Franquia de 4 eventos por mês...' }),
    price: z.number().openapi({ example: 24700 }),
    imageUrl: z.string().nullable().openapi({ example: null }),
    currency: z.string().openapi({ example: 'BRL' }),
    features: z.array(z.string()).default([]).openapi({ example: ['4 eventos inclusos por mês'] }),
    tag: z.string().optional(),
    badge: z.string().optional(),
    subBadge: z.string().optional(),
    costPerEvent: z.string().optional(),
    period: z.string().optional(),
    ctaText: z.string().optional(),
    ctaHref: z.string().openapi({ example: 'prod_b2c_event_pass' }),
    highlighted: z.boolean().optional(),
    devMode: z.boolean().optional().openapi({ example: true })
  })
  .openapi('Plan')

export const plansListResponseSchema = z.array(planSchema).openapi('PlansListResponse')

export const getPlansQuerySchema = z
  .object({
    id: z.string().optional().openapi({
      description: 'Filtrar por identificador de produto específico',
      example: 'prod_b2c_event_pass'
    })
  })
  .openapi('GetPlansQuery')

export const getPlanParamsSchema = z
  .object({
    id: z.string().min(1).openapi({
      description: 'Identificador do produto no AbacatePay (ex: prod_b2c_event_pass ou ID gerado)',
      example: 'prod_b2c_event_pass'
    })
  })
  .openapi('GetPlanParams')
