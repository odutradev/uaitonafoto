import type { LogScope } from '@utils/types/logs'
import type { LogCategoryFilter, LogLevelFilter } from '@pages/app/logs/types'

export interface LogsFiltersProps {
  isAdmin: boolean
  searchInput: string
  levelFilter: LogLevelFilter
  categoryFilter: LogCategoryFilter
  scope: LogScope
  hasActiveFilters: boolean
  onSearchChange: (value: string) => void
  onLevelChange: (nextLevel: LogLevelFilter) => void
  onCategoryChange: (nextCategory: LogCategoryFilter) => void
  onScopeChange: (nextScope: LogScope) => void
  onClearFilters: () => void
}

