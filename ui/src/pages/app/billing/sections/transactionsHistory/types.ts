import type { PurchaseItem, TransactionItem } from '@actions/payments/types'
import type { TransactionStatusFilter, TransactionTypeFilter } from '../../types'

export type UnifiedHistoryEntry =
  | {
      kind: 'transaction'
      id: string
      timestamp: string
      transaction: TransactionItem
      purchase?: PurchaseItem
    }
  | {
      kind: 'purchase'
      id: string
      timestamp: string
      purchase: PurchaseItem
    }

export interface TransactionsHistoryProps {
  purchases: PurchaseItem[]
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
