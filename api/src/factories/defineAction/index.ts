import { createRateLimiter } from '@middlewares/rateLimit'
import manageRequest from '@middlewares/manageRequest'
import authMiddleware from '@domains/users/middlewares/auth'
import requirePermissions from '@middlewares/permissions'
import { registerOpenApiAction } from './openapi'

import type { ManageRequestSchema, ServiceFunction, RouteSchema } from '@middlewares/manageRequest/types'
import type { ActionMetadata, ActionDefinition } from './types'
import type { RequestHandler } from 'express'

const defineAction = <T extends ManageRequestSchema = ManageRequestSchema>(
  metadata: ActionMetadata,
  service: ServiceFunction<T>,
  schema?: RouteSchema
): ActionDefinition => {
  const mergedSchema = metadata.schema ?? schema
  const actionMiddlewares: RequestHandler[] = []

  if (metadata.rateLimit) {
    const rateLimitOptions = typeof metadata.rateLimit === 'object' ? metadata.rateLimit : {}
    const endpointRateLimiter = createRateLimiter({
      endpointPath: metadata.path,
      ...rateLimitOptions
    })
    actionMiddlewares.push(endpointRateLimiter)
  }

  if (metadata.authenticate && (!metadata.middlewares || !metadata.middlewares.includes(authMiddleware))) {
    actionMiddlewares.push(authMiddleware)
  }

  if (metadata.permissions?.length) {
    actionMiddlewares.push(requirePermissions(metadata.permissions))
  }

  if (metadata.middlewares) {
    actionMiddlewares.push(...metadata.middlewares)
  }

  const documentedMetadata: ActionMetadata = {
    ...metadata,
    schema: mergedSchema,
    middlewares: actionMiddlewares
  }

  registerOpenApiAction(documentedMetadata)

  const handler = manageRequest(service, mergedSchema)
  const handlers = [...actionMiddlewares, handler]

  return {
    method: metadata.method,
    path: metadata.path,
    handlers,
    metadata: documentedMetadata
  }
}

export * from './types'
export { registerOpenApiAction } from './openapi'
export { default as registerActions } from './registerActions'
export default defineAction
