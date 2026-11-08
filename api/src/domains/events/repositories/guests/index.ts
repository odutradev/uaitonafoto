import GuestModel from './model'
import type { CreateGuestPayload, GuestEntity } from './types'

const toGuestEntity = (doc: any): GuestEntity => {
  const { _id, ...rest } = doc
  return { ...rest, id: String(_id) }
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

  listByEvent: async (eventId: string): Promise<GuestEntity[]> => {
    const docs = await GuestModel.find({ eventId }).sort({ createdAt: 1 }).lean()
    return docs.map(toGuestEntity)
  },

  deleteByEvent: async (eventId: string): Promise<void> => {
    await GuestModel.deleteMany({ eventId })
  }
}

export default guestRepository
