import type { TransactionItem } from '@actions/payments/types'

export interface TransactionDetailsDialogProps {
  transaction: TransactionItem | null
  onClose: () => void
}
