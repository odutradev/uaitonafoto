import * as admin from 'firebase-admin'

const getPrivateKey = (): string => {
  const key = process.env.FIREBASE_PRIVATE_KEY

  if (!key) return ''

  return key.replace(/\\n/g, '\n')
}

export const hasFirebaseCredentials = (): boolean =>
  Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)

if (!admin.apps.length) {
  admin.initializeApp({
    ...(hasFirebaseCredentials() && {
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: getPrivateKey()
      })
    }),
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined
  })
}

export const firebaseApp = admin.app()
export const firebaseAuth = admin.auth()
export const firestore = admin.firestore()
export const firebaseDb = firestore
export const firebaseStorage = admin.storage()
