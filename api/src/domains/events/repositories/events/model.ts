import { randomBytes } from 'crypto'
import mongoose, { Schema } from 'mongoose'
import type { EventEntity } from './types'

export type EventDocument = Omit<EventEntity, 'id'> & { _id: string }

const memberSchema = new Schema(
  {
    userId: { type: String, required: true },
    role: { type: String, enum: ['creator', 'organizer'], required: true },
    addedAt: { type: String, default: () => new Date().toISOString() }
  },
  { _id: false }
)

const screenSlotSchema = new Schema(
  {
    id: { type: String, required: true, default: () => new mongoose.Types.ObjectId().toString() },
    pin: { type: String, required: true, match: /^\d{4}$/ },
    createdAt: { type: String, default: () => new Date().toISOString() },
    activatedAt: { type: String }
  },
  { _id: false }
)

const settingsSchema = new Schema(
  {
    uploadWindowHours: { type: Number, required: true, min: 0 },
    galleryDurationDays: { type: Number, required: true, min: 1 },
    maxPhotosPerGuest: { type: Number, required: true, min: 1 },
    photoVisibility: { type: String, enum: ['during_event', 'after_event'], required: true },
    pinEnabled: { type: Boolean, default: true },
    pin: { type: String, required: true, match: /^\d{4}$/ },
    pinRotate: { type: Boolean, default: true },
    pinRotationMinutes: { type: Number, enum: [5, 15, 30, 60], default: 15 },
    pinUpdatedAt: { type: String, default: () => new Date().toISOString() }
  },
  { _id: false }
)

const eventSchema = new Schema<EventDocument>(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    type: { type: String, enum: ['birthday', 'wedding', 'corporate', 'other'], required: true },
    startsAt: { type: String, required: true },
    endsAt: { type: String, required: true },
    guestToken: { type: String, required: true, unique: true, default: () => randomBytes(9).toString('base64url') },
    settings: { type: settingsSchema, required: true },
    uploadsCloseAt: { type: String, required: true },
    galleryExpiresAt: { type: String, required: true, index: true },
    galleryCleanedAt: { type: String },
    members: { type: [memberSchema], required: true },
    screens: { type: [screenSlotSchema], default: [] },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: false, versionKey: false }
)

eventSchema.index({ 'members.userId': 1, startsAt: -1 })

export const EventModel = mongoose.models.Event || mongoose.model<EventDocument>('Event', eventSchema)
export default EventModel
