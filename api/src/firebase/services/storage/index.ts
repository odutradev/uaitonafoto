import * as admin from 'firebase-admin'
import type { Bucket } from '@google-cloud/storage'

export * from './types'
export * from './utils'

export const getFirebaseStorage = (): admin.storage.Storage => {
  if (!admin.apps.length) {
    throw new Error('Firebase application is not initialized. Please call connect() first.')
  }
  return admin.storage()
}

export const getStorageBucket = (name?: string): Bucket => {
  const storage = getFirebaseStorage()
  return storage.bucket(name)
}

export const firebaseStorage = new Proxy({} as admin.storage.Storage, {
  get(_, prop: string | symbol) {
    const storage = getFirebaseStorage()
    const value = Reflect.get(storage, prop)
    return typeof value === 'function' ? value.bind(storage) : value
  }
})

export const storageBucket = new Proxy({} as Bucket, {
  get(_, prop: string | symbol) {
    const bucket = getStorageBucket()
    const value = Reflect.get(bucket, prop)
    return typeof value === 'function' ? value.bind(bucket) : value
  }
})

export default firebaseStorage
