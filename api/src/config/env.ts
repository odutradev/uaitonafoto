import createLogger from '@/utils/logger'

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
      throw new Error('JWT_SECRET must be defined with a secure value in production')
    }
    return secret || 'dev-secret-key-change-in-production'
  }

  return secret
}

export const validateEnv = (): void => {
  const isProduction = (process.env.NODE_ENV || process.env.ENV) === 'production'
  const requiredVars = ['FIREBASE_PROJECT_ID']

  if (isProduction) {
    requiredVars.push('FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY')
  }

  const missing = requiredVars.filter((key) => !process.env[key])

  if (missing.length > 0) {
    logger.error(`Missing required environment variables: ${missing.join(', ')}`)
    process.exit(1)
  }

  try {
    getJwtSecret()
  } catch (error) {
    logger.error(error instanceof Error ? error.message : 'Invalid JWT configuration')
    process.exit(1)
  }
}
