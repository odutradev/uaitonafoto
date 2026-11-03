import mongoose, { Schema } from 'mongoose'
import type { LogCategory, LogLevel } from './types'

export interface LogDocument {
  _id: string
  category: LogCategory
  level: LogLevel
  action: string
  title: string
  description?: string
  userId?: string
  userName?: string
  userEmail?: string
  targetId?: string
  targetName?: string
  details?: unknown
  errorMessage?: string
  errorStack?: string
  ipAddress?: string
  createdAt: string
}

const logSchema = new Schema<LogDocument>(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    category: { type: String, enum: ['user', 'admin', 'system'], required: true },
    level: { type: String, enum: ['info', 'warn', 'error'], required: true },
    action: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    userId: { type: String },
    userName: { type: String },
    userEmail: { type: String },
    targetId: { type: String },
    targetName: { type: String },
    details: { type: Schema.Types.Mixed },
    errorMessage: { type: String },
    errorStack: { type: String },
    ipAddress: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  {
    timestamps: false,
    versionKey: false
  }
)

export const LogModel = mongoose.models.Log || mongoose.model<LogDocument>('Log', logSchema)
export default LogModel
