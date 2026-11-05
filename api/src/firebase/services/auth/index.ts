import * as admin from 'firebase-admin'

export const getFirebaseAuth = (): admin.auth.Auth => {
  if (!admin.apps.length) {
    throw new Error('Firebase application is not initialized. Please call connect() first.')
  }
  return admin.auth()
}

export const firebaseAuth = new Proxy({} as admin.auth.Auth, {
  get(_, prop: string | symbol) {
    const auth = getFirebaseAuth()
    const value = Reflect.get(auth, prop)
    return typeof value === 'function' ? value.bind(auth) : value
  }
})

export default firebaseAuth
