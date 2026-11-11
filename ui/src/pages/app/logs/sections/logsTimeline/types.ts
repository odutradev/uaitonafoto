import type { LogItem, LogScope } from '@utils/types/logs'

export interface LogsTimelineProps {
  logs: LogItem[]
  isAdmin: boolean
  scope: LogScope
  page: number
  total: number
  totalPages: number
  isLoading: boolean
  onPageChange: (nextPage: number) => void
  onSelectLog: (item: LogItem) => void
}

