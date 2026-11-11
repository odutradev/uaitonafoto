import type { PaginationMeta } from '@actions/payments/types'

export type AdminPeriod = '7d' | '30d' | '90d' | '6m' | '12m' | 'all'

export interface AdminMetricsParams {
  period?: AdminPeriod
}

export interface AdminMetrics {
  period: AdminPeriod
  periodSummary: {
    newUsers: number
    newEvents: number
    photosUploaded: number
    revenue: number
    paidTransactions: number
  }
  users: {
    total: number
    admins: number
    trialClaimed: number
    totalPaidCredits: number
    totalFreeCredits: number
  }
  events: {
    total: number
    active: number
    closed: number
    totalPhotos: number
    avgPhotosPerEvent: number
  }
  plans: {
    activeSubscriptions: number
    cancelledSubscriptions: number
    totalRevenue: number
    totalTransactions: number
    averageTicket: number
    distribution: Array<{ name: string; count: number }>
  }
  timeline: Array<{
    label: string
    newUsers: number
    newEvents: number
    transactions: number
  }>
}

export interface AdminUserItem {
  id: string
  name: string
  fullName?: string
  email: string
  phone?: string
  photoUrl?: string
  role: 'admin' | 'user'
  freeCredits: number
  paidCredits: number
  hasActiveSubscription: boolean
  planName?: string
  freeTrialClaimedAt?: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedAdminUsersResponse {
  meta: PaginationMeta
  data: AdminUserItem[]
}

export interface ListAdminUsersParams {
  page?: number
  limit?: number
  search?: string
  role?: 'admin' | 'user'
}

export interface AddCreditsPayload {
  amount: number
  type: 'paid' | 'free'
  reason?: string
}

export interface AddCreditsResponse {
  user: AdminUserItem
}

