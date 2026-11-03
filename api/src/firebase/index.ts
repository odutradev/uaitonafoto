import firebase, { connect, connectFirebase, isFirebaseConfigured } from './connect'

export { connect, connectFirebase, isFirebaseConfigured, firebase }
export { firebaseAuth, getFirebaseAuth } from '@firebaseAuth'
export { firestore, getFirestore } from '@firestore'
export * from './types'

export default firebase
