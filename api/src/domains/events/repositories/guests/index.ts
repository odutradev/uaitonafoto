import GuestModel from './model'
import eventRepository from '../events'
import type { EventEntity } from '../events/types'
import type { CreateGuestPayload, GuestEntity } from './types'

const toGuestEntity = (doc: any): GuestEntity => {
  const { _id, ...rest } = doc
  return {
    ...rest,
    id: String(_id),
    isBlocked: Boolean(doc.isBlocked)
  }
}

export const guestRepository = {
  create: async (payload: CreateGuestPayload): Promise<GuestEntity> => {
    const created = await GuestModel.create(payload)
    return toGuestEntity(created.toObject())
  },

  findById: async (id: string): Promise<GuestEntity | null> => {
    const doc = await GuestModel.findById(id).lean()
    return doc ? toGuestEntity(doc) : null
  },

  findContext: async (guestId: string): Promise<{ guest: GuestEntity; event: EventEntity } | null> => {
    const guest = await guestRepository.findById(guestId)
    if (!guest) return null

    const event = await eventRepository.findById(guest.eventId)
    return event ? { guest, event } : null
  },

  findByIds: async (ids: string[]): Promise<GuestEntity[]> => {
    const docs = await GuestModel.find({ _id: { $in: ids } }).lean()
    return docs.map(toGuestEntity)
  },

  listByEvent: async (eventId: string): Promise<GuestEntity[]> => {
    const docs = await GuestModel.find({ eventId }).sort({ createdAt: 1 }).lean()
    return docs.map(toGuestEntity)
  },

  updateName: async (id: string, name: string): Promise<GuestEntity | null> => {
    const doc = await GuestModel.findByIdAndUpdate(id, { $set: { name } }, { new: true, lean: true })
    return doc ? toGuestEntity(doc) : null
  },

  setBlocked: async (id: string, isBlocked: boolean): Promise<GuestEntity | null> => {
    const doc = await GuestModel.findByIdAndUpdate(id, { $set: { isBlocked } }, { new: true, lean: true })
    return doc ? toGuestEntity(doc) : null
  },

  deleteById: async (id: string): Promise<boolean> => {
    const result = await GuestModel.findByIdAndDelete(id)
    return Boolean(result)
  },

  deleteByEvent: async (eventId: string): Promise<void> => {
    await GuestModel.deleteMany({ eventId })
  }
}

export default guestRepository
