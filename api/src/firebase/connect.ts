import * as admin from 'firebase-admin'

import firebaseAuth from '@firebaseAuth'
import firebaseStorage, { getStorageBucket } from '@firebaseStorage'
import { validateEnvVars } from '@utils/env'
import createLogger from '@utils/logger'

import type { FirebaseInstance, FirebaseModule } from './types'

const logger = createLogger('firebase')

const REQUIRED_ENV_VARS = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY'
]

const formatPrivateKey = (key?: string): string => {
  if (!key) return ''
  return key.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '').trim()
}

const formatStorageBucket = (bucket?: string, projectId?: string): string => {
  const rawBucket = bucket?.trim() || (projectId ? `${projectId}.firebasestorage.app` : '')
  return rawBucket.replace(/^gs:\/\//i, '').replace(/\/+$/, '').trim()
}

export const isFirebaseConfigured = (): boolean => validateEnvVars(REQUIRED_ENV_VARS).isValid

const firebase: FirebaseModule = {
  app: null,
  auth: firebaseAuth,
  storage: firebaseStorage,
  initializeFirebase: async (): Promise<FirebaseInstance> => {
    const { isValid, missing } = validateEnvVars(REQUIRED_ENV_VARS)

    if (!isValid) {
      throw new Error(`Missing firebase environment variables: ${missing.join(', ')}`)
    }

    try {
      const projectId = process.env.FIREBASE_PROJECT_ID as string
      const storageBucket = formatStorageBucket(process.env.FIREBASE_STORAGE_BUCKET, projectId)

      if (admin.apps.length > 0 && admin.apps[0]) {
        firebase.app = admin.apps[0]
      } else {
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL as string
        const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY)

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
