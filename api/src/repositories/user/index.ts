import { firebaseDb } from '@database/connection'
import { removeUndefined } from '@utils/object'

import type { UpdateUserPayload, UpsertUserPayload, UserEntity } from './types'

const REF_PATH = 'users'

const userRepository = {
  findById: async (id: string): Promise<UserEntity | null> => {
    const snapshot = await firebaseDb.ref(`${REF_PATH}/${id}`).once('value')
    const data = snapshot.val() as UserEntity | null

    if (!data) return null

    return { ...data, id }
  },

  findByEmail: async (email: string): Promise<UserEntity | null> => {
    const normalized = email.trim().toLowerCase()
    const snapshot = await firebaseDb.ref(REF_PATH).orderByChild('email').equalTo(email.trim()).once('value')
    const exactMatch = snapshot.val() as Record<string, UserEntity> | null

    if (exactMatch) {
      const [id, user] = Object.entries(exactMatch)[0]
      return { ...user, id }
    }

    const allSnapshot = await firebaseDb.ref(REF_PATH).once('value')
    const allUsers = allSnapshot.val() as Record<string, UserEntity> | null

    if (!allUsers) return null

    const found = Object.entries(allUsers).find(([, user]) => user.email?.trim().toLowerCase() === normalized)

    return found ? { ...found[1], id: found[0] } : null
  },

  upsert: async (id: string, payload: UpsertUserPayload): Promise<UserEntity> => {
    const ref = firebaseDb.ref(`${REF_PATH}/${id}`)
    const snapshot = await ref.once('value')
    const existing = snapshot.val() as UserEntity | null
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

    await ref.set(removeUndefined(user))

    return user
  },

  update: async (id: string, data: UpdateUserPayload): Promise<UserEntity | null> => {
    const ref = firebaseDb.ref(`${REF_PATH}/${id}`)
    const snapshot = await ref.once('value')
    const existing = snapshot.val() as UserEntity | null

    if (!existing) return null

    const updated: UserEntity = {
      ...existing,
      ...removeUndefined(data),
      id,
      updatedAt: new Date().toISOString()
    }

    await ref.set(removeUndefined(updated))

    return updated
  }
}

export default userRepository

