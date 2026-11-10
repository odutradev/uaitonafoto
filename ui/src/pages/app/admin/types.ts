import type { AdminMetrics, AdminUserItem } from '@actions/admin'

export interface AdminDashboardState {
  metrics: AdminMetrics | null
  users: AdminUserItem[]
  totalUsers: number
  page: number
  totalPages: number
  search: string
  roleFilter: 'all' | 'admin' | 'user'
  isLoadingMetrics: boolean
  isLoadingUsers: boolean
  selectedUserForCredits: AdminUserItem | null
  isAddCreditsOpen: boolean
  isSubmittingCredits: boolean
}

