import type { LogItem, LogScope } from '@actions/logs/types'

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

