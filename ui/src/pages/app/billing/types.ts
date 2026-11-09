import type {
  CreditUsageItem,
  PlanApiItem,
  PurchaseItem,
  SubscriptionItem,
  TransactionItem,
  TransactionStatus
} from '@actions/payments/types'
import type { AuthUser } from '@stores/auth/types'

export type TransactionTypeFilter = 'ALL' | 'SUBSCRIPTION' | 'ONE_TIME' | 'UPSELL' | 'FREE'
export type TransactionStatusFilter = 'ALL' | TransactionStatus
export type TransactionDirectionFilter = 'ALL' | 'IN' | 'OUT'

export type BillingQueryParams = Record<'checkout' | 'payment' | 'plan' | 'transaction', string>

export interface UseBillingReturn {
  user: AuthUser | null
  plans: PlanApiItem[]
  subscriptions: SubscriptionItem[]
  purchases: PurchaseItem[]
  creditUsages: CreditUsageItem[]
  transactions: TransactionItem[]
  transactionsPage: number
  transactionsTotal: number
  transactionsTotalPages: number
  statusFilter: TransactionStatusFilter
  typeFilter: TransactionTypeFilter
  directionFilter: TransactionDirectionFilter
  isLoadingInitial: boolean
  isLoadingTransactions: boolean
  checkoutPlanId: string | null
  cancellingSubscriptionId: string | null
  selectedTransaction: TransactionItem | null
  confirmingPlan: PlanApiItem | null
  setSelectedTransaction: (item: TransactionItem | null) => void
  handleStatusFilterChange: (nextStatus: TransactionStatusFilter) => void
  handleTypeFilterChange: (nextType: TransactionTypeFilter) => void
  handleDirectionFilterChange: (nextDirection: TransactionDirectionFilter) => void
  handlePageChange: (nextPage: number) => void
  handleRefreshAll: () => Promise<void>
  startCheckout: (planId: string) => Promise<void>
  handleOpenCheckoutConfirmation: (planIdOrPlan: string | PlanApiItem) => void
  handleCloseCheckoutConfirmation: () => void
  handleConfirmCheckout: () => Promise<void>
  handleCancelSubscription: (subscriptionId: string) => Promise<boolean>
}
