import env from '@config/env'

const stripTrailingSlash = (url: string): string => url.replace(/\/+$/, '')

const toOrigin = (url?: string): string | undefined => {
  if (!url) return undefined

  try {
    return new URL(url).origin
  } catch {
    return undefined
  }
}

const listAllowedOrigins = (): string[] =>
  env.CORS_ORIGIN.split(',')
    .map((origin) => stripTrailingSlash(origin.trim()))
    .filter((origin) => origin && origin !== '*')

export const resolveFrontendBaseUrl = (...candidateUrls: Array<string | undefined>): string => {
  const allowedOrigins = listAllowedOrigins()
  const matchedOrigin = candidateUrls
    .map(toOrigin)
    .find((origin): origin is string => Boolean(origin) && allowedOrigins.includes(origin as string))

  return matchedOrigin ?? stripTrailingSlash(env.FRONTEND_URL)
}

export const buildFrontendUrl = (path = '', baseUrl?: string): string => `${stripTrailingSlash(baseUrl ?? env.FRONTEND_URL)}${path}`
