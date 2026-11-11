import type { LogCategory, LogItem, LogLevel, LogScope } from '@utils/types/logs'

export type LogLevelFilter = 'ALL' | LogLevel
export type LogCategoryFilter = 'ALL' | LogCategory

export interface UseLogsReturn {
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
  handleRefresh: () => void
}

