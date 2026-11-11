import type { CreditUsageItem, PlanApiItem, PurchaseItem, SubscriptionItem, TransactionItem } from '@utils/types/payments'
import type { AuthUser } from '@stores/auth/types'
import type { TransactionTypeFilter, TransactionStatusFilter, TransactionDirectionFilter } from '@pages/app/billing/types'

export interface UseBillingPageReturn {
  user: AuthUser | null
  paidCredits: number
  freeCredits: number
  freeTrialClaimed: boolean
  isCheckingOutFreeTrial: boolean
  isCheckoutBusy: boolean
  hasActiveSubscription: boolean
  activeSubscriptionPlanIds: string[]
  isConfirmingCheckout: boolean
  handleClaimFreeTrial: () => Promise<void>
  handleCloseTransaction: () => void
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
