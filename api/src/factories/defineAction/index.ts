import manageRequest from '@middlewares/manageRequest'
import { registry } from '@docs/registry'

import type { ManageRequestSchema, ServiceFunction, RouteSchema } from '@middlewares/manageRequest/types'
import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import type { ActionMetadata, ResponseConfig } from './types'
import type { RequestHandler } from 'express'

const defineAction = <T extends ManageRequestSchema = ManageRequestSchema>(
  metadata: ActionMetadata,
  service: ServiceFunction<T>,
  schema?: RouteSchema
): RequestHandler | RequestHandler[] => {
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

  if (metadata.middlewares) middlewares.push(...metadata.middlewares)

  middlewares.push(handler)

  return middlewares.length === 1 ? middlewares[0] : middlewares
}

export default defineAction
