import eventRepository from '@domains/events/repositories/events'
import GuestModel from './model'

import type { CreateGuestPayload, FindGuestForClientParams, GuestEntity, UpdateGuestSessionPayload } from './types'
import type { EventEntity } from '@domains/events/repositories/events/types'

const toGuestEntity = (doc: any): GuestEntity => {
  const { _id, ...rest } = doc
  return {
    ...rest,
    id: String(_id),
    isBlocked: Boolean(doc.isBlocked)
  }
}

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const guestRepository = {
  create: async (payload: CreateGuestPayload): Promise<GuestEntity> => {
    const created = await GuestModel.create({
      ...payload,
      lastActiveAt: payload.lastActiveAt ?? new Date().toISOString()
    })
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

  findByEventAndDevice: async (eventId: string, deviceId: string): Promise<GuestEntity | null> => {
    if (!deviceId) return null
    const doc = await GuestModel.findOne({ eventId, deviceId }).lean()
    return doc ? toGuestEntity(doc) : null
  },

  findExistingGuestForClient: async ({
    eventId,
    deviceId,
    fingerprint,
    ip,
    name
  }: FindGuestForClientParams): Promise<GuestEntity | null> => {
    if (deviceId) {
      const byDevice = await GuestModel.findOne({ eventId, deviceId }).lean()
      if (byDevice) return toGuestEntity(byDevice)
    }

    if (fingerprint && ip && ip !== 'unknown') {
      const byFingerprintIp = await GuestModel.findOne({ eventId, deviceFingerprint: fingerprint, ip }).lean()
      if (byFingerprintIp) return toGuestEntity(byFingerprintIp)
    }

    if (fingerprint && name?.trim()) {
      const escaped = escapeRegex(name.trim())
      const byFingerprintName = await GuestModel.findOne({
        eventId,
        deviceFingerprint: fingerprint,
        name: { $regex: new RegExp(`^${escaped}$`, 'i') }
      }).lean()
      if (byFingerprintName) return toGuestEntity(byFingerprintName)
    }

    if (fingerprint) {
      const blockedGuest = await GuestModel.findOne({
        eventId,
        deviceFingerprint: fingerprint,
        isBlocked: true
      }).lean()
      if (blockedGuest) return toGuestEntity(blockedGuest)
    }

    return null
  },

  updateSession: async (id: string, payload: UpdateGuestSessionPayload): Promise<GuestEntity | null> => {
    const update: Record<string, unknown> = {
      lastActiveAt: payload.lastActiveAt ?? new Date().toISOString()
    }
    if (payload.name) update.name = payload.name
    if (payload.ip && payload.ip !== 'unknown') update.ip = payload.ip
    if (payload.deviceId) update.deviceId = payload.deviceId
    if (payload.deviceFingerprint) update.deviceFingerprint = payload.deviceFingerprint
    if (payload.userAgent) update.userAgent = payload.userAgent

    const doc = await GuestModel.findByIdAndUpdate(id, { $set: update }, { new: true, lean: true })
    return doc ? toGuestEntity(doc) : null
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
