import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { Refresh as RefreshIcon } from '@mui/icons-material'

import useBilling from './hooks/useBilling'
import BillingSummary from './sections/billingSummary'
import CreditsAndPlans from './sections/creditsAndPlans'
import CurrentPlanCard from './sections/currentPlanCard'
import TransactionsHistory from './sections/transactionsHistory'
import TransactionDetailsDialog from './subcomponents/transactionDetailsDialog'
import CheckoutConfirmationDialog from './subcomponents/checkoutConfirmationDialog'
import { billingPageStyles, headerButtonStyles, headerRowStyles, pageTitleStyles } from './styles'

const FREE_PLAN_ID = 'free_trial'

const Billing = () => {
  const {
    user,
    plans,
    subscriptions,
    purchases,
    creditUsages,
    transactions,
    transactionsPage,
    transactionsTotal,
    transactionsTotalPages,
    statusFilter,
    typeFilter,
    directionFilter,
    isLoadingInitial,
    isLoadingTransactions,
    checkoutPlanId,
    cancellingSubscriptionId,
    selectedTransaction,
    confirmingPlan,
    setSelectedTransaction,
    handleStatusFilterChange,
    handleTypeFilterChange,
    handleDirectionFilterChange,
    handlePageChange,
    handleRefreshAll,
    startCheckout,
    handleOpenCheckoutConfirmation,
    handleCloseCheckoutConfirmation,
    handleConfirmCheckout,
    handleCancelSubscription
  } = useBilling()

  if (!user) return null

  const hasActiveSubscription = subscriptions.some((sub) => sub.status === 'ACTIVE')
  const activeSubscriptionPlanIds = subscriptions
    .filter((sub) => sub.status !== 'CANCELLED')
    .map((sub) => sub.planId)

  return (
    <Box sx={billingPageStyles}>
      <Box component="header" sx={headerRowStyles}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4" component="h1" sx={pageTitleStyles}>
            Planos e transações
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gerencie seus créditos, assinatura e histórico de pagamentos.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          disabled={isLoadingTransactions || isLoadingInitial}
          onClick={handleRefreshAll}
          startIcon={
            isLoadingTransactions ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon fontSize="small" />
          }
          sx={headerButtonStyles}
        >
          Atualizar
        </Button>
      </Box>

      <BillingSummary
        paidCredits={user.paidCredits}
        freeCredits={user.freeCredits}
        freeTrialClaimed={Boolean(user.freeTrialClaimedAt)}
        isCheckingOutFreeTrial={checkoutPlanId === FREE_PLAN_ID}
        isCheckoutBusy={checkoutPlanId !== null}
        onClaimFreeTrial={() => startCheckout(FREE_PLAN_ID)}
      />

      <CurrentPlanCard
        subscriptions={subscriptions}
        cancellingId={cancellingSubscriptionId}
        isCheckoutBusy={checkoutPlanId !== null}
        onCancelSubscription={handleCancelSubscription}
      />

      <CreditsAndPlans
        plans={plans}
        isLoading={isLoadingInitial}
        checkoutPlanId={checkoutPlanId}
        activeSubscriptionPlanIds={activeSubscriptionPlanIds}
        hasActiveSubscription={hasActiveSubscription}
        onSelectPlan={handleOpenCheckoutConfirmation}
      />

      <TransactionsHistory
        purchases={purchases}
        creditUsages={creditUsages}
        transactions={transactions}
        page={transactionsPage}
        total={transactionsTotal}
        totalPages={transactionsTotalPages}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        directionFilter={directionFilter}
        isLoading={isLoadingTransactions}
        onStatusFilterChange={handleStatusFilterChange}
        onTypeFilterChange={handleTypeFilterChange}
        onDirectionFilterChange={handleDirectionFilterChange}
        onPageChange={handlePageChange}
        onSelectTransaction={setSelectedTransaction}
      />

      <TransactionDetailsDialog
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />

      <CheckoutConfirmationDialog
        plan={confirmingPlan}
        open={Boolean(confirmingPlan)}
        isLoading={checkoutPlanId !== null}
        onClose={handleCloseCheckoutConfirmation}
        onConfirm={handleConfirmCheckout}
      />
    </Box>
  )
}

export default Billing
