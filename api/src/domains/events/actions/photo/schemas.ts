import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

import { createPaginatedSchema, paginationQuerySchema } from '@factories/pagination/schemas'

extendZodWithOpenApi(z)

export const photoSchema = z
  .object({
    id: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d50' }),
    url: z.string().openapi({ example: 'https://storage.googleapis.com/bucket/events/ev1/photos/ph1.jpg' }),
    guestId: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d40' }),
    guestName: z.string().openapi({ example: 'Maria' }),
    likesCount: z.number().openapi({ example: 3 }),
    likedByMe: z.boolean().optional().openapi({ description: 'Somente em respostas de convidado' }),
    mine: z.boolean().optional().openapi({ description: 'Somente em respostas de convidado' }),
    status: z.enum(['pending', 'approved', 'rejected']).default('approved').openapi({ example: 'approved' }),
    challengeId: z.string().optional().openapi({ example: '665f1c2e9b1e8a001c8e4d88' }),
    challengeTitle: z.string().optional().openapi({ example: 'Foto com o padrinho mais animado 🕺' }),
    focalY: z.number().min(0).max(100).optional().openapi({ example: 35, description: 'Posição vertical de foco para o telão (0 a 100%)' }),
    createdAt: z.string().openapi({ example: '2026-12-20T22:10:00.000Z' })
  })
  .openapi('PhotoResponse')

export const photoParamsSchema = z
  .object({
    id: z.string().min(1).openapi({ example: '665f1c2e9b1e8a001c8e4d50' })
  })
  .openapi('PhotoParams')

export const listFeedQuerySchema = paginationQuerySchema.openapi('ListFeedQuery')

export const listFeedResponseSchema = createPaginatedSchema(photoSchema, 'ListFeedResponse')

export const likeResponseSchema = z
  .object({
    liked: z.boolean().openapi({ example: true }),
    likesCount: z.number().openapi({ example: 4 })
  })
  .openapi('LikeResponse')
