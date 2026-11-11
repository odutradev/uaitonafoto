import type { LogItem, LogScope } from '@utils/types/logs'
import type { LogLevelFilter, LogCategoryFilter } from '@pages/app/logs/types'

export interface UseLogsPageReturn {
  isAdmin: boolean
  logs: LogItem[]
  page: number
  total: number
  totalPages: number
  searchInput: string
  levelFilter: LogLevelFilter
  categoryFilter: LogCategoryFilter
  scope: LogScope
  isLoading: boolean
  hasActiveFilters: boolean
  selectedLog: LogItem | null
  setSelectedLog: (log: LogItem | null) => void
  setSearchInput: (value: string) => void
  handleLevelChange: (nextLevel: LogLevelFilter) => void
  handleCategoryChange: (nextCategory: LogCategoryFilter) => void
  handleScopeChange: (nextScope: LogScope) => void
  handleClearFilters: () => void
  handlePageChange: (nextPage: number) => void
  handleCloseLog: () => void
  handleRefresh: () => void
}
