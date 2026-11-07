import type { TransactionItem } from '@actions/payments/types'
import type { TransactionStatusFilter, TransactionTypeFilter } from '../../types'

export interface TransactionsHistoryProps {
  transactions: TransactionItem[]
  page: number
  total: number
  totalPages: number
  statusFilter: TransactionStatusFilter
  typeFilter: TransactionTypeFilter
  isLoading: boolean
  onStatusFilterChange: (nextStatus: TransactionStatusFilter) => void
  onTypeFilterChange: (nextType: TransactionTypeFilter) => void
  onPageChange: (nextPage: number) => void
  onSelectTransaction: (item: TransactionItem) => void
}
