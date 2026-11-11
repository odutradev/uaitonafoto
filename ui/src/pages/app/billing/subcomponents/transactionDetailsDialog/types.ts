import type { TransactionItem } from '@utils/types/payments'

export interface TransactionDetailsDialogProps {
  transaction: TransactionItem | null
  onClose: () => void
}
