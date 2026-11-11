import type { AddCreditsPayload, AdminMetrics, AdminPeriod, AdminUserItem } from '@utils/types/admin'

export type AdminRoleFilter = 'all' | 'admin' | 'user'

export interface UseAdminDashboardPageReturn {
  period: AdminPeriod
  setPeriod: (period: AdminPeriod) => void
  metrics: AdminMetrics | null
  isLoadingMetrics: boolean
  isRefreshing: boolean
  users: AdminUserItem[]
  totalUsers: number
  page: number
  limit: number
  totalPages: number
  setLimit: (limit: number) => void
  isLoadingUsers: boolean
  searchInput: string
  setSearchInput: (value: string) => void
  roleFilter: AdminRoleFilter
  setRoleFilter: (role: AdminRoleFilter) => void
  setPage: (page: number) => void
  handleRefresh: () => Promise<void>
  selectedUserForCredits: AdminUserItem | null
  isAddCreditsOpen: boolean
  isSubmittingCredits: boolean
  handleOpenAddCredits: (user: AdminUserItem) => void
  handleCloseAddCredits: () => void
  handleConfirmAddCredits: (payload: AddCreditsPayload) => Promise<void>
}
