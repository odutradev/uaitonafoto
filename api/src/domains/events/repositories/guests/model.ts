import mongoose, { Schema } from 'mongoose'
import type { GuestEntity } from './types'

export type GuestDocument = Omit<GuestEntity, 'id'> & { _id: string }

const guestSchema = new Schema<GuestDocument>(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    eventId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    isBlocked: { type: Boolean, default: false },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: false, versionKey: false }
)

export const GuestModel = mongoose.models.Guest || mongoose.model<GuestDocument>('Guest', guestSchema)
export default GuestModel
