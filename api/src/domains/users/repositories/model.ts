import mongoose, { Schema } from 'mongoose'
import type { UserCustomization, UserRole } from './types'

export interface UserDocument {
  _id: string
  role: UserRole
  name: string
  email: string
  fullName?: string
  phone?: string
  photoUrl?: string
  authProviderId?: string
  freeCredits: number
  paidCredits: number
  freeTrialClaimedAt?: string
  customization?: UserCustomization
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
    freeCredits: { type: Number, default: 0, min: 0 },
    paidCredits: { type: Number, default: 0, min: 0 },
    freeTrialClaimedAt: { type: String },
    customization: {
      enabled: { type: Boolean, default: false },
      agencyName: { type: String, trim: true },
      agencyLogoUrl: { type: String, trim: true },
      agencyWhatsapp: { type: String, trim: true },
      agencyTagline: { type: String, trim: true },
      whatsappMessage: { type: String, trim: true }
    },
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
