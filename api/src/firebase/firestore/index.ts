import * as admin from 'firebase-admin'

export const getFirestore = (): admin.firestore.Firestore => {
  if (!admin.apps.length) {
    throw new Error('Firebase application is not initialized. Please call connect() first.')
  }
  return admin.firestore()
}

export const firestore = new Proxy({} as admin.firestore.Firestore, {
  get(_, prop: string | symbol) {
    const db = getFirestore()
    const value = Reflect.get(db, prop)
    return typeof value === 'function' ? value.bind(db) : value
  }
})

export default firestore
