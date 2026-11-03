import firebase, { connect, connectFirebase, isFirebaseConfigured } from './connect'

export { connect, connectFirebase, isFirebaseConfigured, firebase }
export { firebaseAuth, getFirebaseAuth } from './firebaseAuth'
export { firebaseStorage, getFirebaseStorage, getStorageBucket, storageBucket } from './storage'
export * from './types'

export default firebase
