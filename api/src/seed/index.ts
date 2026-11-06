import 'dotenv/config'
import { getPaymentClient } from '@payment'
import createLogger from '@utils/logger'
import { seedPlans } from './plans'

const logger = createLogger('seed')

const runSeeds = async (): Promise<void> => {
  try {
    logger.info('Running database & gateway seeds...')

    const paymentClient = await getPaymentClient()
    await seedPlans(paymentClient)

    logger.success('All seeds executed successfully!')
    process.exit(0)
  } catch (error) {
    logger.error('Fatal error during seed execution:', error)
    process.exit(1)
  }
}

runSeeds()
