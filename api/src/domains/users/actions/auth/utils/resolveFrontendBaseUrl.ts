import env from '@config/env'

export const resolveFrontendBaseUrl = (redirectUrl?: string, requestOrigin?: string): string => {
  const allowedOrigins = env.CORS_ORIGIN
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter((o) => o && o !== '*')

  if (redirectUrl) {
    try {
      const parsed = new URL(redirectUrl)
      const origin = parsed.origin.replace(/\/+$/, '')
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return origin
      }
    } catch {}
  }

  if (requestOrigin) {
    const cleanOrigin = requestOrigin.replace(/\/+$/, '')
    if (allowedOrigins.length === 0 || allowedOrigins.includes(cleanOrigin)) {
      return cleanOrigin
    }
  }

  if (allowedOrigins.length > 0) {
    return allowedOrigins[0]
  }

  return env.FRONTEND_URL.replace(/\/+$/, '')
}

export default resolveFrontendBaseUrl
