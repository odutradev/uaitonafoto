import mongoose from 'mongoose'
import createLogger from '@utils/logger'

const logger = createLogger('database')

export const isDatabaseConfigured = (): boolean => {
  return Boolean(process.env.MONGODB_URI?.trim())
}

export const connectDatabase = async (): Promise<typeof mongoose> => {
  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB_NAME || 'uaitonafoto'

  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable')
  }

  try {
    const instance = await mongoose.connect(uri, {
      dbName
    })

    logger.success(`Connected: MongoDB database ready (${dbName})`)
    return instance
  } catch (error) {
    logger.error('[connectDatabase] MongoDB connection error:', error)
    throw error
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
