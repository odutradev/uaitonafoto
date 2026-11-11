import mongoose from 'mongoose'
import dns from 'node:dns'

import createLogger from '@utils/logger'
import env from '@config/env'

const logger = createLogger('database')

const configureDnsServers = (): void => {
  const servers = dns.getServers()
  const isLoopbackOnly = servers.length === 0 || servers.every((server) => server === '127.0.0.1' || server === '::1')

  if (isLoopbackOnly) {
    dns.setServers(['8.8.8.8', '1.1.1.1'])
  }
}

export const connectDatabase = async (): Promise<typeof mongoose | undefined> => {
  try {
    configureDnsServers()

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

export const checkDatabaseHealth = (): 'ok' | 'error' => {
  return mongoose.connection.readyState === 1 ? 'ok' : 'error'
}

export default connectDatabase
