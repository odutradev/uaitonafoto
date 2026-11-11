import type { LogItem } from '@utils/types/logs'

export interface LogDetailsDialogProps {
  log: LogItem | null
  isAdmin: boolean
  onClose: () => void
}

