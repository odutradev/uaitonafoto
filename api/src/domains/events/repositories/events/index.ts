import { isValidObjectId } from 'mongoose'
import { removeUndefined } from '@utils/object'
import EventModel from './model'
import type {
  CreateEventPayload,
  EventEntity,
  EventMemberRole,
  EventScreenSlot,
  ListEventsByMemberParams,
  UpdateEventPayload
} from './types'

const toEventEntity = (doc: any): EventEntity => {
  const { _id, settings = {}, screens = [], ...rest } = doc
  return {
    ...rest,
    id: String(_id),
    creditType: rest.creditType ?? 'paid',
    customization: doc.customization ?? undefined,
    closedAt: doc.closedAt ?? undefined,
    screens,
    settings: {
      uploadWindowHours: settings.uploadWindowHours ?? 24,
      galleryDurationDays: settings.galleryDurationDays ?? 30,
      photoVisibility: settings.photoVisibility ?? 'during_event',
      pinEnabled: settings.pinEnabled ?? false,
      pin: settings.pin ?? '0000',
      pinRotate: settings.pinRotate ?? true,
      pinRotationMinutes: settings.pinRotationMinutes ?? 15,
      pinUpdatedAt: settings.pinUpdatedAt ?? rest.createdAt ?? new Date().toISOString(),
      moderationEnabled: Boolean(settings.moderationEnabled),
      challengesEnabled: Boolean(settings.challengesEnabled)
    }
  }
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

  findByIdOrGuestToken: async (identifier: string): Promise<EventEntity | null> => {
    if (isValidObjectId(identifier)) {
      const doc = await EventModel.findById(identifier).lean()
      if (doc) return toEventEntity(doc)
    }
    const doc = await EventModel.findOne({ guestToken: identifier }).lean()
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

  listAllByCreator: async (creatorId: string): Promise<EventEntity[]> => {
    const docs = await EventModel.find({
      members: { $elemMatch: { userId: creatorId, role: 'creator' } }
    })
      .sort({ createdAt: -1 })
      .lean()
    return docs.map(toEventEntity)
  },

  update: async (id: string, { settings, ...data }: UpdateEventPayload): Promise<EventEntity | null> => {
    const updateObj: Record<string, unknown> = {}
    const set = { ...removeUndefined(data), ...flattenSettings(settings), updatedAt: new Date().toISOString() }
    updateObj.$set = set
    if ('closedAt' in data && (data.closedAt === null || data.closedAt === undefined)) {
      updateObj.$unset = { closedAt: 1 }
      delete (set as Record<string, unknown>).closedAt
    }
    const doc = await EventModel.findByIdAndUpdate(id, updateObj, { new: true, lean: true })
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
  },

  addScreenSlot: async (id: string, slot: EventScreenSlot, maxScreens: number): Promise<EventEntity | null> => {
    const doc = await EventModel.findOneAndUpdate(
      { _id: id, [`screens.${maxScreens - 1}`]: { $exists: false } },
      {
        $push: { screens: slot },
        $set: { updatedAt: new Date().toISOString() }
      },
      { new: true, lean: true }
    )
    return doc ? toEventEntity(doc) : null
  },

  removeScreenSlot: async (id: string, screenId: string): Promise<EventEntity | null> => {
    const doc = await EventModel.findOneAndUpdate(
      { _id: id, 'screens.id': screenId },
      {
        $pull: { screens: { id: screenId } },
        $set: { updatedAt: new Date().toISOString() }
      },
      { new: true, lean: true }
    )
    return doc ? toEventEntity(doc) : null
  },

  updateScreenSlotName: async (id: string, screenId: string, name?: string): Promise<EventEntity | null> => {
    const updateObj: Record<string, unknown> = {
      $set: {
        updatedAt: new Date().toISOString()
      }
    }

    if (name) {
      (updateObj.$set as Record<string, unknown>)['screens.$.name'] = name
    } else {
      updateObj.$unset = { 'screens.$.name': '' }
    }

    const doc = await EventModel.findOneAndUpdate(
      { _id: id, 'screens.id': screenId },
      updateObj,
      { new: true, lean: true }
    )
    return doc ? toEventEntity(doc) : null
  },

  activateScreenSlot: async (id: string, screenId: string, activatedAt: string): Promise<EventEntity | null> => {
    const doc = await EventModel.findOneAndUpdate(
      { _id: id, 'screens.id': screenId },
      {
        $set: {
          'screens.$.activatedAt': activatedAt,
          'screens.$.lastSeenAt': activatedAt,
          updatedAt: activatedAt
        }
      },
      { new: true, lean: true }
    )
    return doc ? toEventEntity(doc) : null
  },

  touchScreenLastSeen: async (id: string, screenId: string, lastSeenAt: string): Promise<void> => {
    await EventModel.updateOne(
      { _id: id, 'screens.id': screenId },
      { $set: { 'screens.$.lastSeenAt': lastSeenAt } }
    )
  }
}

export default eventRepository
