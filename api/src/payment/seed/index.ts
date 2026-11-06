import 'dotenv/config'
import { getPaymentClient } from '@payment'
import createLogger from '@utils/logger'
import { seedPlans } from './plans'

const logger = createLogger('payment:seed')

export const runPaymentSeeds = async (): Promise<void> => {
  try {
    logger.info('Running payment & gateway seeds...')

    const paymentClient = await getPaymentClient()
    await seedPlans(paymentClient)

    logger.success('All payment seeds executed successfully!')
  } catch (error) {
    logger.error('Fatal error during payment seed execution:', error)
    throw error
  }
}

// Executa diretamente quando chamado via CLI / script
if (process.argv[1]?.includes('payment/seed') || process.argv[1]?.includes('payment\\seed')) {
  runPaymentSeeds()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

export * from './plans'
export default runPaymentSeeds
