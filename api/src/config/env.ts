import createLogger from '@utils/logger'

const logger = createLogger('env')

const INSECURE_DEFAULTS = new Set([
  'secret-key-change-in-production',
  'super-secret-key-change-in-production',
  'dev-secret-key-change-in-production'
])

export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET || process.env.JWT
  const isProduction = (process.env.NODE_ENV || process.env.ENV) === 'production'

  if (!secret || (isProduction && INSECURE_DEFAULTS.has(secret))) {
    if (isProduction) {
      logger.warn('JWT_SECRET is unset or using an insecure default value! Please define a strong secret in your environment.')
      return secret || '9fa82cb34981e7d23a4b5c6d7e8f0123'
    }
    return secret || 'dev-secret-key-change-in-production'
  }

  return secret
}

export const validateEnv = (): void => {
  const isProduction = (process.env.NODE_ENV || process.env.ENV) === 'production'
  const missing = ['FIREBASE_PROJECT_ID'].filter((key) => !process.env[key])

  if (missing.length > 0) {
    logger.warn(`Missing recommended environment variables: ${missing.join(', ')} (using fallback)`)
    if (!process.env.FIREBASE_PROJECT_ID) {
      process.env.FIREBASE_PROJECT_ID = 'uaitonafoto'
    }
  }

  const missingCredentials = ['FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'].filter((key) => !process.env[key])

  if (isProduction && missingCredentials.length > 0) {
    logger.warn(`Firebase credentials missing (${missingCredentials.join(', ')}): Firebase features will fail until configured`)
  }

  try {
    getJwtSecret()
  } catch (error) {
    logger.warn(error instanceof Error ? error.message : 'Invalid JWT configuration')
  }
}
