import * as admin from 'firebase-admin'

/**
 * Returns the initialized Firestore instance.
 * Throws an error if Firebase has not been connected yet.
 */
export const getFirestore = (): admin.firestore.Firestore => {
  if (!admin.apps.length) {
    throw new Error('Firebase application is not initialized. Please call connect() first.')
  }
  return admin.firestore()
}

/**
 * Transparent proxy for Firestore instance.
 * Resolves the active Firestore database dynamically on every property access.
 */
export const firestore = new Proxy({} as admin.firestore.Firestore, {
  get(_, prop: string | symbol) {
    const db = getFirestore()
    const value = Reflect.get(db, prop)
    return typeof value === 'function' ? value.bind(db) : value
  }
})

export default firestore
