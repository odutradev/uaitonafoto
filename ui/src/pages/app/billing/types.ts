import type {
  PlanApiItem,
  PurchaseItem,
  SubscriptionItem,
  TransactionItem,
  TransactionStatus
} from '@actions/payments/types'
import type { AuthUser } from '@stores/auth/types'

export type TransactionTypeFilter = 'ALL' | 'SUBSCRIPTION' | 'ONE_TIME' | 'UPSELL'
export type TransactionStatusFilter = 'ALL' | TransactionStatus

export type BillingQueryParams = Record<'checkout' | 'payment' | 'plan' | 'transaction', string>

export interface UseBillingReturn {
  user: AuthUser | null
  plans: PlanApiItem[]
  subscriptions: SubscriptionItem[]
  purchases: PurchaseItem[]
  transactions: TransactionItem[]
  transactionsPage: number
  transactionsTotal: number
  transactionsTotalPages: number
  statusFilter: TransactionStatusFilter
  typeFilter: TransactionTypeFilter
  isLoadingInitial: boolean
  isLoadingTransactions: boolean
  checkoutPlanId: string | null
  cancellingSubscriptionId: string | null
  selectedTransaction: TransactionItem | null
  setSelectedTransaction: (item: TransactionItem | null) => void
  handleStatusFilterChange: (nextStatus: TransactionStatusFilter) => void
  handleTypeFilterChange: (nextType: TransactionTypeFilter) => void
  handlePageChange: (nextPage: number) => void
  handleRefreshAll: () => Promise<void>
  startCheckout: (planId: string) => Promise<void>
  handleCancelSubscription: (subscriptionId: string) => Promise<boolean>
}
