import createLogger from '@utils/logger'
import type { EnvValidationResult } from './types'

const logger = createLogger('env')

export const validateEnvVars = (
  variables: string[],
  exitOnError = false
): EnvValidationResult => {
  const missing = variables.filter((key) => !process.env[key]?.trim())
  const isValid = missing.length === 0

  if (!isValid && exitOnError) {
    logger.error(`Missing required environment variables: ${missing.join(', ')}`)
    process.exit(1)
  }

  return { isValid, missing }
}

export * from './types'
export default validateEnvVars
