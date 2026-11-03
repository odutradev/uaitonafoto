export type LogCategory = 'user' | 'admin' | 'system'
export type LogLevel = 'info' | 'warn' | 'error'

export interface CreateLogPayload {
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
}

export interface LogEntity extends CreateLogPayload {
  id: string
  createdAt: string
}
