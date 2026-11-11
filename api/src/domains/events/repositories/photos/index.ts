import PhotoModel from './model'

import type { CreatePhotoPayload, ListPhotosParams, ListPhotosSinceParams, PhotoEntity, PhotoStatus } from './types'

const toPhotoEntity = (doc: any): PhotoEntity => {
  const { _id, ...rest } = doc
  return {
    ...rest,
    status: rest.status ?? 'approved',
    id: String(_id)
  }
}

export const photoRepository = {
  create: async ({ id, status = 'approved', ...payload }: CreatePhotoPayload): Promise<PhotoEntity> => {
    const created = await PhotoModel.create({ _id: id, status, ...payload })
    return toPhotoEntity(created.toObject())
  },

  findById: async (id: string): Promise<PhotoEntity | null> => {
    const doc = await PhotoModel.findById(id).lean()
    return doc ? toPhotoEntity(doc) : null
  },

  countByGuest: (guestId: string): Promise<number> => PhotoModel.countDocuments({ guestId }),

  findCompletedChallengeIdsByGuest: async (guestId: string): Promise<string[]> => {
    const ids = await PhotoModel.distinct('challengeId', {
      guestId,
      challengeId: { $exists: true, $ne: null },
      status: { $ne: 'rejected' }
    })
    return (ids as string[]).filter(Boolean)
  },

  countByGuestsOfEvent: async (eventId: string): Promise<Record<string, number>> => {
    const rows = await PhotoModel.aggregate<{ _id: string; count: number }>([
      { $match: { eventId } },
      { $group: { _id: '$guestId', count: { $sum: 1 } } }
    ])
    return Object.fromEntries(rows.map((row) => [row._id, row.count]))
  },

  listByEvent: async ({
    eventId,
    guestId,
    status = 'all',
    limit,
    offset
  }: ListPhotosParams): Promise<{ count: number; rows: PhotoEntity[] }> => {
    const filter: Record<string, any> = { eventId }
    if (guestId) filter.guestId = guestId
    if (status && status !== 'all') {
      if (status === 'approved') {
        filter.status = { $in: ['approved', null, undefined] }
      } else {
        filter.status = status
      }
    }
    const [count, docs] = await Promise.all([
      PhotoModel.countDocuments(filter),
      PhotoModel.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit).lean()
    ])
    return { count, rows: docs.map(toPhotoEntity) }
  },

  listSince: async ({
    eventId,
    since,
    status = 'approved',
    limit
  }: ListPhotosSinceParams): Promise<PhotoEntity[]> => {
    const filter: Record<string, any> = { eventId }
    if (since) filter.createdAt = { $gt: since }
    if (status && status !== 'all') {
      if (status === 'approved') {
        filter.status = { $in: ['approved', null, undefined] }
      } else {
        filter.status = status
      }
    }
    const docs = await PhotoModel.find(filter).sort({ createdAt: 1 }).limit(limit).lean()
    return docs.map(toPhotoEntity)
  },

  findAllByEvent: async (eventId: string, status?: PhotoStatus | 'all'): Promise<PhotoEntity[]> => {
    const filter: Record<string, any> = { eventId }
    if (status && status !== 'all') {
      if (status === 'approved') {
        filter.status = { $in: ['approved', null, undefined] }
      } else {
        filter.status = status
      }
    }
    const docs = await PhotoModel.find(filter).sort({ createdAt: 1 }).lean()
    return docs.map(toPhotoEntity)
  },

  updateStatus: async (id: string, status: PhotoStatus): Promise<PhotoEntity | null> => {
    const doc = await PhotoModel.findByIdAndUpdate(id, { status }, { new: true, lean: true })
    return doc ? toPhotoEntity(doc) : null
  },

  countPendingByEvent: async (eventId: string): Promise<number> => {
    return PhotoModel.countDocuments({ eventId, status: 'pending' })
  },

  approveAllPending: async (eventId: string): Promise<PhotoEntity[]> => {
    const pendingDocs = await PhotoModel.find({ eventId, status: 'pending' }).lean()
    if (pendingDocs.length === 0) return []
    await PhotoModel.updateMany({ eventId, status: 'pending' }, { status: 'approved' })
    return pendingDocs.map((doc) => ({ ...toPhotoEntity(doc), status: 'approved' }))
  },

  addLikes: async (id: string, delta: number): Promise<number | null> => {
    const doc = await PhotoModel.findByIdAndUpdate(id, { $inc: { likesCount: delta } }, { new: true, lean: true })
    return doc ? Math.max(0, doc.likesCount) : null
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await PhotoModel.deleteOne({ _id: id })
    return result.deletedCount > 0
  },

  deleteByEvent: async (eventId: string): Promise<void> => {
    await PhotoModel.deleteMany({ eventId })
  }
}

export default photoRepository
