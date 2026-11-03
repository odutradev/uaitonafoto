import type * as admin from 'firebase-admin'

export type FirebaseInstance = {
  app: admin.app.App
  auth: admin.auth.Auth
  firestore: admin.firestore.Firestore
  projectId: string
}

export type FirebaseModule = {
  app: admin.app.App | null
  initializeFirebase: () => Promise<FirebaseInstance>
  getInstance: () => Promise<admin.app.App>
  connect: () => Promise<FirebaseInstance>
  auth: admin.auth.Auth
  firestore: admin.firestore.Firestore
}
