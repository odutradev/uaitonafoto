import type * as admin from 'firebase-admin'
import type { Bucket } from '@google-cloud/storage'

export type FirebaseInstance = {
  app: admin.app.App
  auth: admin.auth.Auth
  firestore: admin.firestore.Firestore
  storage: admin.storage.Storage
  storageBucket: string
  bucket: Bucket
  projectId: string
}

export type FirebaseModule = {
  app: admin.app.App | null
  initializeFirebase: () => Promise<FirebaseInstance>
  getInstance: () => Promise<admin.app.App>
  connect: () => Promise<FirebaseInstance>
  auth: admin.auth.Auth
  firestore: admin.firestore.Firestore
  storage: admin.storage.Storage
}
