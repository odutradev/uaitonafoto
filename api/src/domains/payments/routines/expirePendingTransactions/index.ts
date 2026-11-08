import createLogger from '@utils/logger'
import syncOrExpirePendingTransactions from '../../utils/syncOrExpirePendingTransactions'

const logger = createLogger('payments:expire-routine')

const ROUTINE_INTERVAL_MS = 15 * 60 * 1000

let intervalTimer: ReturnType<typeof setInterval> | null = null
let isRunning = false

export const runExpirePendingTransactions = async (): Promise<void> => {
  if (isRunning) return
  isRunning = true

  try {
    const result = await syncOrExpirePendingTransactions({ checkGateway: true })
    if (result.expiredCount > 0 || result.gatewayUpdatedCount > 0) {
      logger.info(
        `Routine completed: ${result.expiredCount} pending transactions expired by time, ${result.gatewayUpdatedCount} updated via gateway.`
      )
    }
  } catch (error) {
    logger.error('Error running expire pending transactions routine:', error)
  } finally {
    isRunning = false
  }
}

export const startExpirePendingTransactionsRoutine = (): void => {
  if (intervalTimer) return

  runExpirePendingTransactions().catch((error) => {
    logger.warn('Initial expire pending transactions run failed:', error)
  })

  intervalTimer = setInterval(() => {
    runExpirePendingTransactions().catch((error) => {
      logger.warn('Scheduled expire pending transactions run failed:', error)
    })
  }, ROUTINE_INTERVAL_MS)

  intervalTimer.unref()
  logger.info('Pending checkout expiration routine started')
}

export const stopExpirePendingTransactionsRoutine = (): void => {
  if (!intervalTimer) return
  clearInterval(intervalTimer)
  intervalTimer = null
}
