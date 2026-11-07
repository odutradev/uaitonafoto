import type { TransactionItem } from '@actions/payments/types'

export interface InvoicesProps {
  invoices: TransactionItem[]
  page: number
  totalPages: number
  isLoading: boolean
  onPageChange: (page: number) => void
}
