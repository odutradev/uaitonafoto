import { Router } from 'express'
import createLogger from '@utils/logger'
import type { DomainDefinition, DomainRegistry, ActionHandler } from './types'

const logger = createLogger('domain')

export const registeredDomains: DomainRegistry = new Map()

export const isActionHandler = (action: unknown): action is ActionHandler => {
  return (
    typeof action === 'function' &&
    'metadata' in action &&
    typeof (action as ActionHandler).metadata === 'object' &&
    (action as ActionHandler).metadata !== null &&
    typeof (action as ActionHandler).metadata.method === 'string' &&
    typeof (action as ActionHandler).metadata.path === 'string'
  )
}

const extractActionHandlers = (
  obj: Record<string, unknown>,
  prefix = ''
): Array<{ name: string; action: ActionHandler }> => {
  const result: Array<{ name: string; action: ActionHandler }> = []

  for (const [key, value] of Object.entries(obj)) {
    const fullName = prefix ? `${prefix}.${key}` : key
    if (isActionHandler(value)) {
      result.push({ name: fullName, action: value })
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      result.push(...extractActionHandlers(value as Record<string, unknown>, fullName))
    }
  }

  return result
}

export const registerDomain = (domain: DomainDefinition): void => {
  const isAlreadyRegistered = registeredDomains.has(domain.name)
  registeredDomains.set(domain.name, domain)

  if (!isAlreadyRegistered) {
    const actionCount = Object.keys(domain.actions || {}).length
    logger.info(`Domain registered: [${domain.name}] with ${actionCount} actions`)
  }
}

export const registerDomains = (domains: DomainDefinition[]): void => {
  for (const domain of domains) {
    registerDomain(domain)
  }
}

export const getRegisteredDomain = (name: string): DomainDefinition | undefined => {
  return registeredDomains.get(name)
}

export const getRegisteredDomains = (): DomainRegistry => {
  return registeredDomains
}

export const registerDomainEndpoints = (
  router: Router,
  domains?: DomainDefinition[]
): Router => {
  const targetDomains = domains ?? Array.from(registeredDomains.values())
  const registeredEndpoints = new Set<string>()

  for (const domain of targetDomains) {
    const actions = (domain.actions || {}) as Record<string, unknown>
    const actionEntries = extractActionHandlers(actions)

    for (const { name, action } of actionEntries) {
      const { method, path } = action.metadata
      const normalizedPath = path.startsWith('/') ? path : `/${path}`
      const httpMethod = method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch'
      const endpointKey = `${httpMethod.toUpperCase()} ${normalizedPath}`

      if (registeredEndpoints.has(endpointKey)) {
        logger.warn(`Endpoint ${endpointKey} already registered. Skipping duplicate from ${domain.name}.${name}`)
        continue
      }

      if (typeof router[httpMethod] === 'function') {
        const handlers = action.middlewares?.length ? action.middlewares : [action]
        router[httpMethod](normalizedPath, ...handlers)
        registeredEndpoints.add(endpointKey)
        logger.info(`Endpoint registered: [${httpMethod.toUpperCase()}] ${normalizedPath} (${domain.name}.${name})`)
      } else {
        logger.warn(`Unsupported HTTP method: ${method} for action ${domain.name}.${name}`)
      }
    }
  }

  return router
}

export const createDomainRouter = (domains?: DomainDefinition[]): Router => {
  const router = Router()
  return registerDomainEndpoints(router, domains)
}

export * from './types'
export default registerDomains
