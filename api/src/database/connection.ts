import * as admin from 'firebase-admin'

const getPrivateKey = (): string => {
  let key = process.env.FIREBASE_PRIVATE_KEY

  if (!key) return ''

  key = key.trim()
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1)
  }

  // Handle base64 encoded private keys (common in docker/ci environments)
  if (!key.includes('BEGIN PRIVATE KEY') && !key.includes('---')) {
    try {
      const decoded = Buffer.from(key, 'base64').toString('utf-8')
      if (decoded.includes('BEGIN PRIVATE KEY')) {
        key = decoded
      }
    } catch {}
  }

  return key.replace(/\r\n/g, '\n').replace(/\\n/g, '\n')
}

export const hasFirebaseCredentials = (): boolean =>
  Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)

if (!admin.apps.length) {
  let initialized = false
  const projectId = process.env.FIREBASE_PROJECT_ID || 'uaitonafoto'
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || undefined

  if (hasFirebaseCredentials()) {
    try {
      const privateKey = getPrivateKey()
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey
        }),
        projectId,
        storageBucket
      })
      initialized = true
    } catch (error) {
      console.error('[Firebase] Error initializing Firebase Admin with credentials:', error)
    }
  }

  if (!initialized) {
    try {
      admin.initializeApp({
        projectId,
        storageBucket
      })
    } catch (fallbackError) {
      console.error('[Firebase] Error initializing fallback Firebase Admin app:', fallbackError)
    }
  }
}

export const firebaseApp = admin.apps.length ? admin.app() : (null as unknown as admin.app.App)
export const firebaseAuth = admin.apps.length ? admin.auth() : (null as unknown as admin.auth.Auth)
export const firestore = admin.apps.length ? admin.firestore() : (null as unknown as admin.firestore.Firestore)
export const firebaseDb = firestore
export const firebaseStorage = admin.apps.length ? admin.storage() : (null as unknown as admin.storage.Storage)
