import type { LogScope } from '@actions/logs/types'
import type { LogCategoryFilter, LogLevelFilter } from '../../types'

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

