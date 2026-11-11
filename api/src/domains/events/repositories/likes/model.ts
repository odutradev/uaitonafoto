import mongoose, { Schema } from 'mongoose'

import type { LikeEntity } from './types'

export type LikeDocument = Omit<LikeEntity, 'id'> & { _id: string }

const likeSchema = new Schema<LikeDocument>(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    eventId: { type: String, required: true, index: true },
    photoId: { type: String, required: true },
    guestId: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: false, versionKey: false }
)

likeSchema.index({ photoId: 1, guestId: 1 }, { unique: true })

export const LikeModel = mongoose.models.Like || mongoose.model<LikeDocument>('Like', likeSchema)
export default LikeModel
