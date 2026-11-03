import { removeUndefined } from '@utils/object'
import UserModel from './model'
import type { UpdateUserPayload, UpsertUserPayload, UserEntity } from './types'

const toUserEntity = (doc: any): UserEntity => ({
  id: String(doc._id || doc.id),
  role: doc.role,
  name: doc.name,
  email: doc.email,
  fullName: doc.fullName,
  phone: doc.phone,
  photoUrl: doc.photoUrl ?? '',
  authProviderId: doc.authProviderId,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt
})

export const userRepository = {
  findById: async (id: string): Promise<UserEntity | null> => {
    const doc = await UserModel.findById(id).lean()
    if (!doc) return null
    return toUserEntity(doc)
  },

  findByEmail: async (email: string): Promise<UserEntity | null> => {
    const normalized = email.trim().toLowerCase()
    const doc = await UserModel.findOne({ email: normalized }).lean()
    if (!doc) return null
    return toUserEntity(doc)
  },

  upsert: async (id: string, payload: UpsertUserPayload): Promise<UserEntity> => {
    const existing = await UserModel.findById(id).lean()
    const now = new Date().toISOString()
    const normalizedEmail = payload.email.trim().toLowerCase()

    const updateData = removeUndefined({
      name: existing?.name || payload.name,
      email: normalizedEmail,
      photoUrl: existing?.photoUrl || payload.photoUrl || '',
      authProviderId: payload.authProviderId ?? existing?.authProviderId ?? 'google',
      updatedAt: now
    })

    const doc = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: updateData,
        $setOnInsert: {
          _id: id,
          role: 'user',
          createdAt: now
        }
      },
      { new: true, upsert: true, lean: true }
    )

    return toUserEntity(doc)
  },

  update: async (id: string, data: UpdateUserPayload): Promise<UserEntity | null> => {
    const now = new Date().toISOString()
    const updateData = removeUndefined({
      ...data,
      updatedAt: now
    })

    const doc = await UserModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, lean: true }
    )

    if (!doc) return null
    return toUserEntity(doc)
  }
}



export default userRepository
