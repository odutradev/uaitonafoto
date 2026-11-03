import createLogger from '@utils/logger'

const logger = createLogger('env')

export interface EnvValidationResult {
  isValid: boolean
  missing: string[]
}

/**
 * Validates if required environment variables are present and non-empty.
 *
 * @param variables Array of environment variable names to check.
 * @param exitOnError If true, logs an error and terminates the process when validation fails.
 * @returns Result object containing `isValid` and list of `missing` variable keys.
 */
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

export default validateEnvVars
