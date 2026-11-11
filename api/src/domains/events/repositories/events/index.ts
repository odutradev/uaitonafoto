import { isValidObjectId } from 'mongoose'

import { buildCreatedAtFilter } from '@utils/date'
import { removeUndefined } from '@utils/object'
import EventModel from './model'

import type { CreateEventPayload, EventEntity, EventMemberRole, EventNotificationKey, EventScreenHistoryEntry, EventScreenSlot, ListEventsByMemberParams, UpdateEventPayload } from './types'
import type { CreatedAtRange } from '@utils/date/types'
import type { EventDocument } from './model'

const toEventEntity = (doc: EventDocument): EventEntity => {
  const { _id, settings, screens = [], ...rest } = doc
  const storedSettings: Partial<EventDocument['settings']> = settings ?? {}
  return {
    ...rest,
    id: String(_id),
    creditType: rest.creditType ?? 'paid',
    planTier: rest.planTier ?? 'single',
    customization: doc.customization ?? undefined,
    closedAt: doc.closedAt ?? undefined,
    screens: screens.map((screen) => ({
      ...screen,
      isBlocked: Boolean(screen.isBlocked)
    })),
    screenHistory: doc.screenHistory ?? [],
    settings: {
      uploadWindowHours: storedSettings.uploadWindowHours ?? 24,
      galleryDurationDays: storedSettings.galleryDurationDays ?? 30,
      photoVisibility: storedSettings.photoVisibility ?? 'during_event',
      pinEnabled: storedSettings.pinEnabled ?? false,
      pin: storedSettings.pin ?? '0000',
      pinRotate: storedSettings.pinRotate ?? true,
      pinRotationMinutes: storedSettings.pinRotationMinutes ?? 15,
      pinUpdatedAt: storedSettings.pinUpdatedAt ?? rest.createdAt ?? new Date().toISOString(),
      moderationEnabled: Boolean(storedSettings.moderationEnabled),
      challengesEnabled: Boolean(storedSettings.challengesEnabled),
      challengesMode: storedSettings.challengesMode ?? 'choose',
      uploadCooldownSeconds: storedSettings.uploadCooldownSeconds ?? 60
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

  listPendingReminders: async (nowIso: string, untilIso: string): Promise<EventEntity[]> => {
    const docs = await EventModel.find({
      startsAt: { $gt: nowIso, $lte: untilIso },
      closedAt: { $exists: false },
      'notifications.reminderSentAt': { $exists: false }
    }).lean()
    return docs.map(toEventEntity)
  },

  listPendingSummaries: async (sinceIso: string, nowIso: string): Promise<EventEntity[]> => {
    const docs = await EventModel.find({
      'notifications.summarySentAt': { $exists: false },
      galleryCleanedAt: { $exists: false },
      $or: [{ closedAt: { $gte: sinceIso, $lte: nowIso } }, { endsAt: { $gte: sinceIso, $lte: nowIso } }]
    }).lean()
    return docs.map(toEventEntity)
  },

  listGalleriesExpiringSoon: async (nowIso: string, untilIso: string): Promise<EventEntity[]> => {
    const docs = await EventModel.find({
      galleryExpiresAt: { $gt: nowIso, $lte: untilIso },
      galleryCleanedAt: { $exists: false },
      'notifications.galleryExpiringSentAt': { $exists: false }
    }).lean()
    return docs.map(toEventEntity)
  },

  claimNotification: async (id: string, key: EventNotificationKey): Promise<boolean> => {
    const field = `notifications.${key}`
    const result = await EventModel.updateOne(
      { _id: id, [field]: { $exists: false } },
      { $set: { [field]: new Date().toISOString() } }
    )
    return result.modifiedCount > 0
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
    const updatedAt = new Date().toISOString()
    const updateObj = name
      ? { $set: { updatedAt, 'screens.$.name': name } }
      : { $set: { updatedAt }, $unset: { 'screens.$.name': '' } }

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

  setScreenSlotBlocked: async (
    id: string,
    screenId: string,
    isBlocked: boolean
  ): Promise<EventEntity | null> => {
    const updateObj: Record<string, unknown> = {
      $set: {
        'screens.$.isBlocked': isBlocked,
        updatedAt: new Date().toISOString()
      }
    }
    if (isBlocked) {
      (updateObj.$set as Record<string, unknown>)['screens.$.activatedAt'] = undefined
    }

    const doc = await EventModel.findOneAndUpdate(
      { _id: id, 'screens.id': screenId },
      updateObj,
      { new: true, lean: true }
    )
    return doc ? toEventEntity(doc) : null
  },

  touchScreenLastSeen: async (id: string, screenId: string, lastSeenAt: string): Promise<void> => {
    await EventModel.updateOne(
      { _id: id, 'screens.id': screenId },
      { $set: { 'screens.$.lastSeenAt': lastSeenAt } }
    )
  },

  addScreenHistory: async (
    id: string,
    entry: EventScreenHistoryEntry,
    maxEntries = 30
  ): Promise<EventEntity | null> => {
    const doc = await EventModel.findByIdAndUpdate(
      id,
      {
        $push: { screenHistory: { $each: [entry], $slice: -maxEntries } },
        $set: { updatedAt: new Date().toISOString() }
      },
      { new: true, lean: true }
    )
    return doc ? toEventEntity(doc) : null
  },

  countAll: async (range?: CreatedAtRange): Promise<number> => {
    return EventModel.countDocuments(buildCreatedAtFilter(range))
  },

  countClosed: async (): Promise<number> => {
    return EventModel.countDocuments({ closedAt: { $exists: true, $ne: null } })
  }
}

export default eventRepository
