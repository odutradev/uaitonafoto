import mongoose, { Schema } from 'mongoose'
import type { PhotoEntity } from './types'

export type PhotoDocument = Omit<PhotoEntity, 'id'> & { _id: string }

const photoSchema = new Schema<PhotoDocument>(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    eventId: { type: String, required: true },
    guestId: { type: String, required: true },
    storagePath: { type: String, required: true },
    url: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    likesCount: { type: Number, required: true, default: 0, min: 0 },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: false, versionKey: false }
)

photoSchema.index({ eventId: 1, createdAt: -1 })
photoSchema.index({ eventId: 1, status: 1, createdAt: -1 })
photoSchema.index({ guestId: 1 })

export const PhotoModel = mongoose.models.Photo || mongoose.model<PhotoDocument>('Photo', photoSchema)
export default PhotoModel
