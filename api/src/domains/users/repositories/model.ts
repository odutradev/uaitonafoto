import mongoose, { Schema } from 'mongoose'
import type { UserRole } from './types'

export interface UserDocument {
  _id: string
  role: UserRole
  name: string
  email: string
  fullName?: string
  phone?: string
  photoUrl?: string
  authProviderId?: string
  createdAt: string
  updatedAt: string
}

const userSchema = new Schema<UserDocument>(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    fullName: { type: String },
    phone: { type: String },
    photoUrl: { type: String, default: '' },
    authProviderId: { type: String, default: 'google' },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() }
  },
  {
    timestamps: false,
    versionKey: false
  }
)

export const UserModel = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema)
export default UserModel
