import { firebaseApp } from '@database/connection'
import createLogger from '@utils/logger'

const logger = createLogger('database')

const database = {
  connect: async (): Promise<{ clusterName: string }> => {
    try {
      if (!firebaseApp) {
        throw new Error('Firebase app is not initialized')
      }

      const projectId = process.env.FIREBASE_PROJECT_ID || 'uaitonafoto'

      if (!process.env.FIREBASE_PROJECT_ID) {
        logger.warn('FIREBASE_PROJECT_ID is not defined, using default fallback')
      }

      logger.success(`Connected: Firebase App (${projectId})`)

      return { clusterName: projectId }
    } catch (error) {
      logger.error('Connection error:', error)
      process.exit(1)
    }
  },
  disconnect: async (): Promise<void> => {
    if (firebaseApp) {
      await firebaseApp.delete()
    }
  },
  isValidUUID: (id: string): boolean => {
    if (!id || typeof id !== 'string') return false
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(id)
  }
}

export default database
