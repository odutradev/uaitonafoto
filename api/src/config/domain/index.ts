import usersDomain from '@domains/users'
import systemDomain from '@domains/system'
import createLogger from '@utils/logger'
import type { DomainDefinition, DomainRegistry } from './types'

const logger = createLogger('domain')

export const registeredDomains: DomainRegistry = new Map()

export const registerDomain = (domain: DomainDefinition): void => {
  registeredDomains.set(domain.name, domain)
  const actionCount = Object.keys(domain.actions || {}).length
  logger.info(`Domain registered: [${domain.name}] with ${actionCount} actions`)
}

export const registerDomains = (domains?: DomainDefinition[]): void => {
  const targetDomains = domains ?? [usersDomain, systemDomain]
  for (const domain of targetDomains) {
    registerDomain(domain)
  }
}

export const getRegisteredDomain = (name: string): DomainDefinition | undefined => {
  return registeredDomains.get(name)
}

export const getRegisteredDomains = (): DomainRegistry => {
  return registeredDomains
}

export * from './types'
export default registerDomains
