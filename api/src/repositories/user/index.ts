import { firestore } from '@database/connection'
import { removeUndefined } from '@utils/object'

import type { UpdateUserPayload, UpsertUserPayload, UserEntity } from './types'

const COLLECTION_NAME = 'users'

const userRepository = {
  findById: async (id: string): Promise<UserEntity | null> => {
    const doc = await firestore.collection(COLLECTION_NAME).doc(id).get()

    if (!doc.exists) return null

    return { ...(doc.data() as UserEntity), id: doc.id }
  },

  findByEmail: async (email: string): Promise<UserEntity | null> => {
    const normalized = email.trim().toLowerCase()
    const snapshot = await firestore
      .collection(COLLECTION_NAME)
      .where('email', '==', normalized)
      .limit(1)
      .get()

    if (snapshot.empty) return null

    const doc = snapshot.docs[0]
    return { ...(doc.data() as UserEntity), id: doc.id }
  },

  upsert: async (id: string, payload: UpsertUserPayload): Promise<UserEntity> => {
    const docRef = firestore.collection(COLLECTION_NAME).doc(id)
    const doc = await docRef.get()
    const existing = doc.exists ? (doc.data() as UserEntity) : null
    const now = new Date().toISOString()

    const user: UserEntity = {
      id,
      role: existing?.role ?? 'user',
      name: existing?.name || payload.name,
      email: payload.email.trim().toLowerCase(),
      ...(existing?.fullName ? { fullName: existing.fullName } : {}),
      ...(existing?.phone ? { phone: existing.phone } : {}),
      photoUrl: existing?.photoUrl || payload.photoUrl || '',
      authProviderId: payload.authProviderId ?? existing?.authProviderId ?? 'google',
      createdAt: existing?.createdAt ?? now,
      updatedAt: now
    }

    await docRef.set(removeUndefined(user), { merge: true })

    return user
  },

  update: async (id: string, data: UpdateUserPayload): Promise<UserEntity | null> => {
    const docRef = firestore.collection(COLLECTION_NAME).doc(id)
    const doc = await docRef.get()

    if (!doc.exists) return null

    const existing = doc.data() as UserEntity
    const updated: UserEntity = {
      ...existing,
      ...removeUndefined(data),
      id,
      updatedAt: new Date().toISOString()
    }

    await docRef.set(removeUndefined(updated), { merge: true })

    return updated
  }
}

export default userRepository
