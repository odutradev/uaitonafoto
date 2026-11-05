import mongoose from 'mongoose'
import env from '@config/env'
import createLogger from '@utils/logger'

const logger = createLogger('database')

export const connectDatabase = async (): Promise<typeof mongoose | undefined> => {
  try {
    const instance = await mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB_NAME
    })

    logger.success(`Connected: MongoDB database ready (${env.MONGODB_DB_NAME})`)
    return instance
  } catch (error) {
    logger.error('[connectDatabase] MongoDB connection error:', error)
    process.exit(1)
  }
}

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect()
    logger.info('MongoDB disconnected')
  } catch (error) {
    logger.error('Error disconnecting MongoDB:', error)
  }
}

export default connectDatabase
