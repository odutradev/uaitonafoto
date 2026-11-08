import { removeUndefined } from '@utils/object'
import EventModel from './model'
import type {
  CreateEventPayload,
  EventEntity,
  EventMemberRole,
  ListEventsByMemberParams,
  UpdateEventPayload
} from './types'

const toEventEntity = (doc: any): EventEntity => {
  const { _id, ...rest } = doc
  return { ...rest, id: String(_id) }
}

const flattenSettings = (settings: UpdateEventPayload['settings']): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(removeUndefined(settings ?? {})).map(([key, value]) => [`settings.${key}`, value])
  )

export const eventRepository = {
  create: async ({ creatorId, ...payload }: CreateEventPayload): Promise<EventEntity> => {
    const created = await EventModel.create(
      removeUndefined({
        ...payload,
        members: [{ userId: creatorId, role: 'creator' }]
      })
    )
    return toEventEntity(created.toObject())
  },

  findById: async (id: string): Promise<EventEntity | null> => {
    const doc = await EventModel.findById(id).lean()
    return doc ? toEventEntity(doc) : null
  },

  findByGuestToken: async (guestToken: string): Promise<EventEntity | null> => {
    const doc = await EventModel.findOne({ guestToken }).lean()
    return doc ? toEventEntity(doc) : null
  },

  listByMember: async ({
    userId,
    limit,
    offset
  }: ListEventsByMemberParams): Promise<{ count: number; rows: EventEntity[] }> => {
    const filter = { 'members.userId': userId }
    const [count, docs] = await Promise.all([
      EventModel.countDocuments(filter),
      EventModel.find(filter).sort({ startsAt: -1 }).skip(offset).limit(limit).lean()
    ])
    return { count, rows: docs.map(toEventEntity) }
  },

  update: async (id: string, { settings, ...data }: UpdateEventPayload): Promise<EventEntity | null> => {
    const set = { ...removeUndefined(data), ...flattenSettings(settings), updatedAt: new Date().toISOString() }
    const doc = await EventModel.findByIdAndUpdate(id, { $set: set }, { new: true, lean: true })
    return doc ? toEventEntity(doc) : null
  },

  listExpiredGalleries: async (nowIso: string): Promise<EventEntity[]> => {
    const docs = await EventModel.find({
      galleryExpiresAt: { $lte: nowIso },
      galleryCleanedAt: { $exists: false }
    }).lean()
    return docs.map(toEventEntity)
  },

  markGalleryCleaned: async (id: string): Promise<void> => {
    await EventModel.updateOne({ _id: id }, { $set: { galleryCleanedAt: new Date().toISOString() } })
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await EventModel.deleteOne({ _id: id })
    return result.deletedCount > 0
  },

  addMember: async (id: string, userId: string, role: EventMemberRole): Promise<EventEntity | null> => {
    const doc = await EventModel.findOneAndUpdate(
      { _id: id, 'members.userId': { $ne: userId } },
      { $push: { members: { userId, role, addedAt: new Date().toISOString() } } },
      { new: true, lean: true }
    )
    return doc ? toEventEntity(doc) : null
  },

  removeMember: async (id: string, userId: string): Promise<EventEntity | null> => {
    const doc = await EventModel.findOneAndUpdate(
      { _id: id, members: { $elemMatch: { userId, role: { $ne: 'creator' } } } },
      { $pull: { members: { userId } } },
      { new: true, lean: true }
    )
    return doc ? toEventEntity(doc) : null
  }
}

export default eventRepository
