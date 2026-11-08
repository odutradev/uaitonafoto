import 'dotenv/config'
import createLogger from '@utils/logger'
import { serverEnvSchema, type ServerEnv } from './types'

const logger = createLogger('env')

const validateServerEnv = (): ServerEnv => {
  const result = serverEnvSchema.safeParse(process.env)

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n')

    logger.error(`Configuração inválida de variáveis de ambiente (.env):\n${issues}`)
    process.exit(1)
  }

  return result.data
}

export const env = validateServerEnv()

export const {
  NODE_ENV,
  PORT,
  FRONTEND_URL,
  CORS_ORIGIN,
  JWT_SECRET,
  MONGODB_URI,
  MONGODB_DB_NAME,
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_STORAGE_BUCKET,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM,
  SWAGGER_ENABLED,
  ENABLE_ROUTINES,
  ABACATEPAY_API_KEY,
  ABACATEPAY_WEBHOOK_SECRET,
  CHECKOUT_EXPIRATION_HOURS
} = env

export const getJwtSecret = (): string => env.JWT_SECRET

export const validateEnv = (): ServerEnv => env

export * from './types'
export default env
