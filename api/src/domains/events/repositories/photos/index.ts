import PhotoModel from './model'
import type { CreatePhotoPayload, ListPhotosParams, ListPhotosSinceParams, PhotoEntity } from './types'

const toPhotoEntity = (doc: any): PhotoEntity => {
  const { _id, ...rest } = doc
  return { ...rest, id: String(_id) }
}

export const photoRepository = {
  create: async ({ id, ...payload }: CreatePhotoPayload): Promise<PhotoEntity> => {
    const created = await PhotoModel.create({ _id: id, ...payload })
    return toPhotoEntity(created.toObject())
  },

  findById: async (id: string): Promise<PhotoEntity | null> => {
    const doc = await PhotoModel.findById(id).lean()
    return doc ? toPhotoEntity(doc) : null
  },

  countByGuest: (guestId: string): Promise<number> => PhotoModel.countDocuments({ guestId }),

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
    limit,
    offset
  }: ListPhotosParams): Promise<{ count: number; rows: PhotoEntity[] }> => {
    const filter = guestId ? { eventId, guestId } : { eventId }
    const [count, docs] = await Promise.all([
      PhotoModel.countDocuments(filter),
      PhotoModel.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit).lean()
    ])
    return { count, rows: docs.map(toPhotoEntity) }
  },

  listSince: async ({ eventId, since, limit }: ListPhotosSinceParams): Promise<PhotoEntity[]> => {
    const filter = since ? { eventId, createdAt: { $gt: since } } : { eventId }
    const docs = await PhotoModel.find(filter).sort({ createdAt: 1 }).limit(limit).lean()
    return docs.map(toPhotoEntity)
  },

  findAllByEvent: async (eventId: string): Promise<PhotoEntity[]> => {
    const docs = await PhotoModel.find({ eventId }).sort({ createdAt: 1 }).lean()
    return docs.map(toPhotoEntity)
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
