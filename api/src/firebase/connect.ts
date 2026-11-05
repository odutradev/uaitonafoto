import * as admin from 'firebase-admin'

import firebaseAuth from '@firebase/services/auth'
import firebaseStorage, { getStorageBucket } from '@firebase/services/storage'
import env from '@config/env'
import createLogger from '@utils/logger'

import type { FirebaseInstance, FirebaseModule } from './types'

const logger = createLogger('firebase')

const formatPrivateKey = (key: string): string => {
  return key.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '').trim()
}

const formatStorageBucket = (bucket: string): string => {
  return bucket.replace(/^gs:\/\//i, '').replace(/\/+$/, '').trim()
}

const firebase: FirebaseModule = {
  app: null,
  auth: firebaseAuth,
  storage: firebaseStorage,
  initializeFirebase: async (): Promise<FirebaseInstance> => {
    try {
      const projectId = env.FIREBASE_PROJECT_ID
      const storageBucket = formatStorageBucket(env.FIREBASE_STORAGE_BUCKET)

      if (admin.apps.length > 0 && admin.apps[0]) {
        firebase.app = admin.apps[0]
      } else {
        const clientEmail = env.FIREBASE_CLIENT_EMAIL
        const privateKey = formatPrivateKey(env.FIREBASE_PRIVATE_KEY)

        firebase.app = admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey
          }),
          projectId,
          storageBucket
        })
      }

      logger.success(`Connected: Firebase services ready [Auth, Storage] (${projectId} | ${storageBucket})`)

      return {
        app: firebase.app,
        auth: firebase.auth,
        storage: firebase.storage,
        storageBucket,
        bucket: getStorageBucket(storageBucket),
        projectId
      }
    } catch (error) {
      logger.error('[initializeFirebase] Firebase initialization error')
      logger.clean(error)
      process.exit(1)
    }
  },
  getInstance: async (): Promise<admin.app.App> => {
    if (!firebase.app) {
      logger.info('[getInstance] Firebase not initialized, initializing now')
      await firebase.initializeFirebase()
      if (!firebase.app) {
        logger.error('[getInstance] Failed to initialize Firebase app')
        throw new Error('Failed to initialize Firebase app')
      }
    }
    return firebase.app
  },
  connect: async (): Promise<FirebaseInstance> => {
    return firebase.initializeFirebase()
  }
}

export const connect = firebase.initializeFirebase
export const connectFirebase = firebase.initializeFirebase

export default firebase
