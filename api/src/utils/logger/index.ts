import { formatTimestamp } from '@utils/date'
import type { Logger } from './types'

const COLORS = {
  magenta: '\x1b[35m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
} as const

const buildLogPrefix = (prefix: string, level: string, color: string): string => {
  return `${COLORS.gray}[${formatTimestamp()}]${COLORS.reset} ${color}[${prefix}] [${level}]${COLORS.reset}`
}

export const createLogger = (prefix: string): Logger => ({
  success: (message: unknown, ...args: unknown[]) => {
    console.log(`${buildLogPrefix(prefix, 'SUCCESS', COLORS.green)}`, message, ...args)
  },
  error: (message: unknown, ...args: unknown[]) => {
    console.error(`${buildLogPrefix(prefix, 'ERROR', COLORS.red)}`, message, ...args)
  },
  debug: (message: unknown, ...args: unknown[]) => {
    console.debug(`${buildLogPrefix(prefix, 'DEBUG', COLORS.magenta)}`, message, ...args)
  },
  info: (message: unknown, ...args: unknown[]) => {
    console.info(`${buildLogPrefix(prefix, 'INFO', COLORS.blue)}`, message, ...args)
  },
  warn: (message: unknown, ...args: unknown[]) => {
    console.warn(`${buildLogPrefix(prefix, 'WARN', COLORS.yellow)}`, message, ...args)
  },
  clean: (message: unknown, ...args: unknown[]) => {
    console.log(message, ...args)
  }
})


export default createLogger
