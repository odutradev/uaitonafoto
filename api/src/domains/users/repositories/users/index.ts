import { buildCreatedAtFilter } from '@utils/date'
import { removeUndefined } from '@utils/object'
import UserModel from './model'

import type { CreditType, ListUsersParams, UpdateUserPayload, UpsertUserPayload, UserEntity, UserRole } from './types'
import type { CreatedAtRange } from '@utils/date/types'
import type { UserDocument } from './model'

const toUserEntity = (doc: UserDocument & { id?: string }): UserEntity => ({
  id: String(doc._id || doc.id),
  role: doc.role,
  name: doc.name,
  email: doc.email,
  fullName: doc.fullName,
  phone: doc.phone,
  photoUrl: doc.photoUrl ?? '',
  authProviderId: doc.authProviderId,
  freeCredits: doc.freeCredits ?? 0,
  paidCredits: doc.paidCredits ?? 0,
  freeTrialClaimedAt: doc.freeTrialClaimedAt ?? undefined,
  customization: doc.customization ?? undefined,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt
})

export const userRepository = {
  findById: async (id: string): Promise<UserEntity | null> => {
    const doc = await UserModel.findById(id).lean()
    if (!doc) return null
    return toUserEntity(doc)
  },

  findByIds: async (ids: string[]): Promise<UserEntity[]> => {
    if (ids.length === 0) return []
    const docs = await UserModel.find({ _id: { $in: ids } }).lean()
    return docs.map(toUserEntity)
  },

  listByRole: async (role: UserRole): Promise<UserEntity[]> => {
    const docs = await UserModel.find({ role }).lean()
    return docs.map(toUserEntity)
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

    const isValidName = (value?: string | null): boolean => {
      if (!value) return false
      const trimmed = value.trim().toLowerCase()
      return trimmed.length > 0 && trimmed !== 'unknown'
    }

    const resolvedName = isValidName(payload.name)
      ? payload.name.trim()
      : isValidName(existing?.name)
        ? existing!.name.trim()
        : normalizedEmail.split('@')[0] || 'Usuário'

    const resolvedFullName = isValidName(payload.fullName)
      ? payload.fullName!.trim()
      : isValidName(existing?.fullName)
        ? existing!.fullName!.trim()
        : resolvedName !== 'Usuário'
          ? resolvedName
          : undefined

    const updateData = removeUndefined({
      name: resolvedName,
      fullName: resolvedFullName,
      email: normalizedEmail,
      photoUrl: existing?.photoUrl || payload.photoUrl || '',
      authProviderId: payload.authProviderId ?? existing?.authProviderId ?? 'google',
      updatedAt: now
    })

    const doc = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: updateData,
        $max: { freeCredits: 0, paidCredits: 0 },
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
  },

  addCredits: async (id: string, type: CreditType, amount: number): Promise<UserEntity | null> => {
    const field = type === 'free' ? 'freeCredits' : 'paidCredits'

    const doc = await UserModel.findByIdAndUpdate(
      id,
      { $inc: { [field]: amount }, $set: { updatedAt: new Date().toISOString() } },
      { new: true, lean: true }
    )

    if (!doc) return null
    return toUserEntity(doc)
  },

  deductCredits: async (id: string, type: CreditType, amount: number): Promise<UserEntity | null> => {
    if (amount <= 0) return userRepository.findById(id)

    const field = type === 'free' ? 'freeCredits' : 'paidCredits'

    const doc = await UserModel.findOneAndUpdate(
      { _id: id, [field]: { $gte: amount } },
      {
        $inc: { [field]: -amount },
        $set: { updatedAt: new Date().toISOString() }
      },
      { new: true, lean: true }
    )

    if (!doc) return null
    return toUserEntity(doc)
  },

  claimFreeTrial: async (id: string, credits: number): Promise<UserEntity | null> => {
    const now = new Date().toISOString()

    const doc = await UserModel.findOneAndUpdate(
      {
        _id: id,
        $or: [{ freeTrialClaimedAt: { $exists: false } }, { freeTrialClaimedAt: null }]
      },
      {
        $inc: { freeCredits: credits },
        $set: { freeTrialClaimedAt: now, updatedAt: now }
      },
      { new: true, lean: true }
    )

    if (!doc) return null
    return toUserEntity(doc)
  },

  listPaginated: async ({
    limit = 20,
    offset = 0,
    search,
    role
  }: ListUsersParams = {}): Promise<{ rows: UserEntity[]; count: number }> => {
    const filter: Record<string, unknown> = {}

    if (role) {
      filter.role = role
    }

    if (search?.trim()) {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(sanitized, 'i')
      filter.$or = [{ name: regex }, { fullName: regex }, { email: regex }]
    }

    const [docs, count] = await Promise.all([
      UserModel.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit).lean(),
      UserModel.countDocuments(filter)
    ])

    return {
      rows: docs.map(toUserEntity),
      count
    }
  },

  countAll: async (range?: CreatedAtRange): Promise<number> => {
    return UserModel.countDocuments(buildCreatedAtFilter(range))
  },

  countByRole: async (role: string): Promise<number> => {
    return UserModel.countDocuments({ role })
  },

  countTrialClaimed: async (): Promise<number> => {
    return UserModel.countDocuments({ freeTrialClaimedAt: { $exists: true, $ne: null } })
  },

  sumCredits: async (): Promise<{ totalPaid: number; totalFree: number }> => {
    const [result] = await UserModel.aggregate([
      {
        $group: {
          _id: null,
          totalPaid: { $sum: '$paidCredits' },
          totalFree: { $sum: '$freeCredits' }
        }
      }
    ])
    return { totalPaid: result?.totalPaid ?? 0, totalFree: result?.totalFree ?? 0 }
  }
}

export default userRepository
