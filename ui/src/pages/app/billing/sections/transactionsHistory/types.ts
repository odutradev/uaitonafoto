import type { CreditUsageItem, PurchaseItem, TransactionItem } from '@actions/payments/types'
import type {
  TransactionDirectionFilter,
  TransactionStatusFilter,
  TransactionTypeFilter
} from '../../types'

export type UnifiedHistoryEntry =
  | {
      kind: 'transaction'
      id: string
      timestamp: string
      transaction: TransactionItem
    }
  | {
      kind: 'purchase'
      id: string
      timestamp: string
      purchase: PurchaseItem
    }
  | {
      kind: 'usage'
      id: string
      timestamp: string
      usage: CreditUsageItem
    }

export interface TransactionsHistoryProps {
  purchases: PurchaseItem[]
  creditUsages: CreditUsageItem[]
  transactions: TransactionItem[]
  page: number
  total: number
  totalPages: number
  statusFilter: TransactionStatusFilter
  typeFilter: TransactionTypeFilter
  directionFilter: TransactionDirectionFilter
  isLoading: boolean
  onStatusFilterChange: (nextStatus: TransactionStatusFilter) => void
  onTypeFilterChange: (nextType: TransactionTypeFilter) => void
  onDirectionFilterChange: (nextDirection: TransactionDirectionFilter) => void
  onPageChange: (nextPage: number) => void
  onSelectTransaction: (item: TransactionItem) => void
}
