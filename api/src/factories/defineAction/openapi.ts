import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

import { errorResponseSchema } from '@factories/errors/schemas'
import registry from '@factories/docs/registry'

import type { ActionMetadata, DocumentedMiddleware, ResponseConfig } from './types'
import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import type { ZodTypeAny } from 'zod'

extendZodWithOpenApi(z)

const buildBodySchema = (metadata: ActionMetadata): ZodTypeAny | undefined => {
  const declaredBody = metadata.schema?.body
  if (metadata.requestFormat !== 'multipart') return declaredBody

  const fieldName = metadata.uploadFieldName ?? 'file'
  const fileSchema = z.string().openapi({ type: 'string', format: 'binary', description: 'Upload file' })

  if (declaredBody instanceof z.ZodObject) return declaredBody.extend({ [fieldName]: fileSchema })
  return z.object({ [fieldName]: fileSchema })
}

export const registerOpenApiAction = (metadata: ActionMetadata): void => {
  const defaultResponses: Record<string, ResponseConfig> = {
    200: { description: 'Sucesso' },
    400: { description: 'Requisição inválida', schema: errorResponseSchema },
    422: { description: 'Erro de validação dos dados', schema: errorResponseSchema },
    500: { description: 'Erro interno', schema: errorResponseSchema }
  }

  const documentedMiddlewares = (metadata.middlewares ?? []).map((middleware) => middleware as DocumentedMiddleware)
  const middlewareAuthenticate = documentedMiddlewares.some((middleware) => Boolean(middleware.authenticate))
  const middlewareResponses = documentedMiddlewares.reduce<Record<string, ResponseConfig>>(
    (acc, middleware) => ({ ...acc, ...(middleware.responses ?? {}) }),
    {}
  )

  const mergedResponses = { ...defaultResponses, ...middlewareResponses, ...metadata.responses }

  const responses = Object.entries(mergedResponses).reduce<RouteConfig['responses']>(
    (acc, [code, value]) => ({
      ...acc,
      [code]: {
        description: value.description,
        content: value.schema
          ? { 'application/json': { schema: value.schema as ZodTypeAny } }
          : undefined
      }
    }),
    {}
  )

  const isAuthenticate = metadata.authenticate ?? middlewareAuthenticate

  const security = metadata.security ?? (isAuthenticate
    ? [{ bearerAuth: [] }]
    : undefined)

  const bodySchema = buildBodySchema(metadata)

  const requestBody = metadata.requestBody
    ?? (bodySchema
      ? {
          content: {
            [metadata.requestFormat === 'multipart' ? 'multipart/form-data' : 'application/json']: {
              schema: bodySchema as ZodTypeAny
            }
          }
        }
      : undefined)

  const request: RouteConfig['request'] = {
    params: metadata.schema?.params,
    query: metadata.schema?.query,
    body: requestBody
  }

  const openApiPath = metadata.path.replace(/:([a-zA-Z0-9_]+)/g, '{$1}')

  registry.registerPath({
    method: metadata.method,
    path: openApiPath,
    summary: metadata.summary,
    tags: metadata.tags,
    security,
    request,
    responses
  })
}

export default registerOpenApiAction
