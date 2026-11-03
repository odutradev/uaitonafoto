import * as admin from 'firebase-admin'
import createLogger from '@utils/logger'

const logger = createLogger('database')

const formatPrivateKey = (key?: string): string => {
  if (!key) return ''
  return key.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '').trim()
}

const initializeFirebase = (): void => {
  if (admin.apps.length > 0) return

  const projectId = process.env.FIREBASE_PROJECT_ID || 'uaitonafoto'
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY)

  if (clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey
      }),
      projectId
    })
    return
  }

  admin.initializeApp({ projectId })
}

let initError: Error | null = null

try {
  initializeFirebase()
} catch (error) {
  initError = error instanceof Error ? error : new Error(String(error))
}

export const firestore = admin.apps.length ? admin.firestore() : (null as unknown as admin.firestore.Firestore)
export const firebaseAuth = admin.apps.length ? admin.auth() : (null as unknown as admin.auth.Auth)

const database = {
  connect: async (): Promise<{ clusterName: string }> => {
    try {
      if (initError) {
        throw initError
      }

      if (!admin.apps.length) {
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
  }
}

export { database }
export default database
