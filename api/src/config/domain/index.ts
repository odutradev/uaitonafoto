import { Router } from 'express'

import { createRateLimiter } from '@middlewares/rateLimit'
import createLogger from '@utils/logger'

import type { DomainDefinition, DomainRegistry, ActionDefinition, ActionHandler } from './types'

const logger = createLogger('domain')

export const registeredDomains: DomainRegistry = new Map()

export const isActionDefinition = (action: unknown): action is ActionDefinition => {
  return (
    typeof action === 'object' &&
    action !== null &&
    'method' in action &&
    'path' in action &&
    'handlers' in action &&
    Array.isArray((action as ActionDefinition).handlers)
  )
}

export const isActionHandler = (action: unknown): action is ActionHandler => {
  return isActionDefinition(action)
}

const extractActionHandlers = (
  obj: Record<string, unknown>,
  prefix = ''
): Array<{ name: string; action: ActionDefinition }> => {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullName = prefix ? `${prefix}.${key}` : key
    if (isActionDefinition(value)) return [{ name: fullName, action: value }]
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return extractActionHandlers(value as Record<string, unknown>, fullName)
    }
    return []
  })
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
  domains.forEach((domain) => registerDomain(domain))
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

  targetDomains.forEach((domain) => {
    const domainLimiter = domain.rateLimit
      ? typeof domain.rateLimit === 'function'
        ? domain.rateLimit
        : createRateLimiter({
            domainName: domain.name,
            ...domain.rateLimit
          })
      : null

    const actions = (domain.actions || {}) as Record<string, unknown>
    const actionEntries = extractActionHandlers(actions)

    actionEntries.forEach(({ name, action }) => {
      const { method, path, handlers } = action
      const normalizedPath = path.startsWith('/') ? path : `/${path}`
      const httpMethod = method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch'
      const endpointKey = `${httpMethod.toUpperCase()} ${normalizedPath}`

      if (registeredEndpoints.has(endpointKey)) {
        logger.warn(`Endpoint ${endpointKey} already registered. Skipping duplicate from ${domain.name}.${name}`)
        return
      }

      const isWebhook =
        normalizedPath.endsWith('/webhook') ||
        normalizedPath.endsWith('/webhook/')

      const actionHandlers =
        domainLimiter && !isWebhook
          ? [domainLimiter, ...handlers]
          : handlers

      if (typeof router[httpMethod] !== 'function') {
        logger.warn(`Unsupported HTTP method: ${method} for action ${domain.name}.${name}`)
        return
      }

      router[httpMethod](normalizedPath, ...actionHandlers)
      registeredEndpoints.add(endpointKey)
    })
  })

  return router
}

export const createDomainRouter = (domains?: DomainDefinition[]): Router => {
  const router = Router()
  return registerDomainEndpoints(router, domains)
}

export * from './types'
