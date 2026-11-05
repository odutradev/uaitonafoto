import manageRequest from '@middlewares/manageRequest'
import { registry } from '@docs/registry'
import authMiddleware from '@domains/users/middlewares/auth'
import requirePermissions from '@middlewares/permissions'

import type { ManageRequestSchema, ServiceFunction, RouteSchema } from '@middlewares/manageRequest/types'
import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import type { ActionMetadata, ActionHandler, ResponseConfig } from './types'
import type { RequestHandler } from 'express'

const defineAction = <T extends ManageRequestSchema = ManageRequestSchema>(
  metadata: ActionMetadata,
  service: ServiceFunction<T>,
  schema?: RouteSchema
): ActionHandler => {
  const defaultResponses: Record<string, ResponseConfig> = {
    200: { description: 'Sucesso' },
    400: { description: 'Requisição inválida' },
    500: { description: 'Erro interno' }
  }

  if (metadata.authenticate) {
    defaultResponses[401] = { description: 'Token não fornecido ou inválido' }
    defaultResponses[403] = { description: 'Acesso negado' }
  }

  const mergedResponses = { ...defaultResponses, ...metadata.responses }
  const responses: RouteConfig['responses'] = {}

  Object.entries(mergedResponses).forEach(([code, value]) => {
    responses[code] = {
      description: value.description,
      content: value.schema ? { 'application/json': { schema: value.schema } } : undefined
    }
  })

  const security = metadata.security ?? (metadata.authenticate ? [{ bearerAuth: [] }] : undefined)
  const requestBody = metadata.requestBody ?? (schema?.body ? { content: { 'application/json': { schema: schema.body } } } : undefined)

  const request = {
    params: schema?.params,
    query: schema?.query,
    body: requestBody
  }

  registry.registerPath({
    method: metadata.method,
    path: metadata.path,
    summary: metadata.summary,
    tags: metadata.tags,
    security,
    request,
    responses
  })

  const handler = manageRequest(service, schema)
  const middlewares: RequestHandler[] = []

  if (metadata.authenticate && (!metadata.middlewares || !metadata.middlewares.includes(authMiddleware))) {
    middlewares.push(authMiddleware)
  }

  if (metadata.permissions?.length) {
    middlewares.push(requirePermissions(metadata.permissions))
  }

  if (metadata.middlewares) {
    middlewares.push(...metadata.middlewares)
  }

  middlewares.push(handler)

  const compositeHandler: RequestHandler = (req, res, next) => {
    let index = 0
    const nextMiddleware = (err?: unknown) => {
      if (err) return next(err)
      const current = middlewares[index++]
      if (!current) return
      current(req, res, nextMiddleware)
    }
    nextMiddleware()
  }

  const action = Object.assign(compositeHandler, {
    metadata,
    middlewares
  })

  return action as ActionHandler
}

export * from './types'
export default defineAction
