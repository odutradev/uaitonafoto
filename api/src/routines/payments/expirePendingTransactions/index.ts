import syncOrExpirePendingTransactions from '@domains/payments/utils/syncOrExpirePendingTransactions'
import { defineRoutine } from '@config/routine'
import createLogger from '@utils/logger'

const logger = createLogger('payments:expire-routine')

export const runExpirePendingTransactions = async (): Promise<void> => {
  const result = await syncOrExpirePendingTransactions({ checkGateway: true })
  if (result.expiredCount > 0 || result.gatewayUpdatedCount > 0) {
    logger.info(
      `Routine completed: ${result.expiredCount} pending transactions expired by time, ${result.gatewayUpdatedCount} updated via gateway.`
    )
  }
}

export const expirePendingTransactionsRoutine = defineRoutine({
  name: 'expirePendingTransactions',
  description: 'Expire pending checkout transactions and sync recent ones with the gateway',
  cronExpression: '*/15 * * * *',
  runOnInit: true,
  handler: runExpirePendingTransactions
})

export default expirePendingTransactionsRoutine

