import type { LogItem } from '@actions/logs/types'

export interface LogDetailsDialogProps {
  log: LogItem | null
  isAdmin: boolean
  onClose: () => void
}

