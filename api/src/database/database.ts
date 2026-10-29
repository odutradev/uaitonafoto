import { firebaseApp } from '@/database/connection'
import createLogger from '@/utils/logger'

const logger = createLogger('database')

const database = {
  connect: async (): Promise<{ clusterName: string }> => {
    try {
      const projectId = process.env.FIREBASE_PROJECT_ID

      if (!projectId) {
        throw new Error('FIREBASE_PROJECT_ID is not defined')
      }

      logger.success(`Connected: Firebase App (${projectId})`)

      return { clusterName: projectId }
    } catch (error) {
      logger.error('Connection error:', error)
      process.exit(1)
    }
  },
  disconnect: async (): Promise<void> => {
    await firebaseApp.delete()
  },
  isValidUUID: (id: string): boolean => {
    if (!id || typeof id !== 'string') return false
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(id)
  }
}

export default database
