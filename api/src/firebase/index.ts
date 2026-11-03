import * as admin from 'firebase-admin'
import createLogger from '@utils/logger'

const logger = createLogger('firebase')

const REQUIRED_ENV_VARS = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY'
] as const

const formatPrivateKey = (key?: string): string => {
  if (!key) return ''
  return key.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '').trim()
}

const initializeFirebase = (): void => {
  if (admin.apps.length > 0) return

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY)

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey
      }),
      projectId
    })
  }
}

let initError: Error | null = null

try {
  initializeFirebase()
} catch (error) {
  initError = error instanceof Error ? error : new Error(String(error))
}

export const firebaseAuth = admin.apps.length ? admin.auth() : (null as unknown as admin.auth.Auth)
export const firestore = admin.apps.length ? admin.firestore() : (null as unknown as admin.firestore.Firestore)

const firebase = {
  connect: async (): Promise<{ projectId: string }> => {
    try {
      const missingVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]?.trim())

      if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
      }

      if (initError) {
        throw initError
      }

      if (!admin.apps.length) {
        initializeFirebase()
      }

      if (!admin.apps.length) {
        throw new Error('Firebase app is not initialized')
      }

      if (!firebaseAuth || !firestore) {
        throw new Error('Firebase services are not available')
      }

      const projectId = process.env.FIREBASE_PROJECT_ID!

      logger.success(`Connected: Firebase services ready [Auth, Firestore] (${projectId})`)

      return { projectId }
    } catch (error) {
      logger.error('Firebase connection error:', error)
      process.exit(1)
    }
  }
}

export { firebase }
export default firebase
