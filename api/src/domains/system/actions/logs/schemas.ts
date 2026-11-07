import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

import { createPaginatedSchema, paginationQuerySchema } from '@factories/pagination/schemas'

extendZodWithOpenApi(z)

export const logCategorySchema = z.enum(['user', 'admin', 'system']).openapi({ example: 'user' })
export const logLevelSchema = z.enum(['info', 'warn', 'error']).openapi({ example: 'info' })
export const logScopeSchema = z.enum(['me', 'all']).openapi({ example: 'me' })

export const logItemSchema = z
  .object({
    id: z.string().openapi({ example: '665f1c2e9b1e8a001c8e4d99' }),
    category: logCategorySchema,
    level: logLevelSchema,
    action: z.string().openapi({ example: 'AUTH_LOGIN' }),
    title: z.string().openapi({ example: 'Login efetuado' }),
    description: z.string().optional().openapi({ example: 'Usuário autenticou no sistema (google.com)' }),
    userId: z.string().optional().openapi({ example: 'firebase-uid' }),
    userName: z.string().optional().openapi({ example: 'João Dutra' }),
    userEmail: z.string().optional().openapi({ example: 'joao@uaitonafoto.odutra.com' }),
    targetId: z.string().optional().openapi({ example: '665f1c2e9b1e8a001c8e4d11' }),
    targetName: z.string().optional().openapi({ example: 'Agência Pro' }),
    details: z.unknown().optional(),
    errorMessage: z.string().optional(),
    ipAddress: z.string().optional().openapi({ example: '127.0.0.1' }),
    createdAt: z.string().openapi({ example: '2026-11-06T20:00:00.000Z' })
  })
  .openapi('LogItemResponse')

export const listLogsQuerySchema = z
  .object({
    level: logLevelSchema.optional().openapi({
      param: { description: 'Filtrar por severidade do log (info, warn, error)' }
    }),
    category: logCategorySchema.optional().openapi({
      param: { description: 'Filtrar por categoria (user, admin, system)' }
    }),
    action: z.string().max(80).optional().openapi({
      example: 'AUTH_LOGIN',
      param: { description: 'Filtrar por código exato da ação' }
    }),
    search: z.string().max(120).optional().openapi({
      example: 'Login',
      param: { description: 'Busca textual em título, descrição, ação ou usuário' }
    }),
    scope: logScopeSchema.optional().openapi({
      param: { description: 'Escopo da busca (all disponível apenas para administradores)' }
    })
  })
  .merge(paginationQuerySchema)
  .openapi('ListLogsQuery')

export const listLogsResponseSchema = createPaginatedSchema(logItemSchema, 'ListLogsResponse')
