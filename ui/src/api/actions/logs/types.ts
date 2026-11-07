import type { PaginationMeta } from '@actions/payments/types'

export type LogCategory = 'user' | 'admin' | 'system'
export type LogLevel = 'info' | 'warn' | 'error'
export type LogScope = 'me' | 'all'

export interface LogItem {
  id: string
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
  ipAddress?: string
  createdAt: string
}

export interface PaginatedLogsResponse {
  meta: PaginationMeta
  data: LogItem[]
}

export interface GetLogsParams {
  page?: number
  limit?: number
  level?: LogLevel
  category?: LogCategory
  action?: string
  search?: string
  scope?: LogScope
}
