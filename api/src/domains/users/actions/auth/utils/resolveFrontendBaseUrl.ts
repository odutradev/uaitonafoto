export const resolveFrontendBaseUrl = (redirectUrl?: string, requestOrigin?: string): string => {
  const allowedConfig = process.env.CORS_ORIGIN || process.env.CORS_ALLOWED_ORIGINS || ''
  const allowedOrigins = allowedConfig
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

  return (process.env.FRONTEND_URL || 'http://localhost:1000').replace(/\/+$/, '')
}

export default resolveFrontendBaseUrl
