import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { Refresh as RefreshIcon } from '@mui/icons-material'

import useBilling from './hooks/useBilling'
import BillingSummary from './sections/billingSummary'
import CreditsAndPlans from './sections/creditsAndPlans'
import CurrentPlanCard from './sections/currentPlanCard'
import TransactionsHistory from './sections/transactionsHistory'
import TransactionDetailsDialog from './subcomponents/transactionDetailsDialog'
import { billingPageStyles, headerButtonStyles, headerRowStyles, pageTitleStyles } from './styles'

const FREE_PLAN_ID = 'free_trial'
const EXTRA_CREDIT_ID = 'prod_agency_extra_credit'

const Billing = () => {
  const {
    user,
    plans,
    subscriptions,
    purchases,
    transactions,
    transactionsPage,
    transactionsTotal,
    transactionsTotalPages,
    statusFilter,
    typeFilter,
    isLoadingInitial,
    isLoadingTransactions,
    checkoutPlanId,
    cancellingSubscriptionId,
    selectedTransaction,
    setSelectedTransaction,
    handleStatusFilterChange,
    handleTypeFilterChange,
    handlePageChange,
    handleRefreshAll,
    startCheckout,
    handleCancelSubscription
  } = useBilling()

  if (!user) return null

  const activeSubscription = subscriptions.find((sub) => sub.status !== 'CANCELLED') ?? null
  const hasActiveSubscription = subscriptions.some((sub) => sub.status === 'ACTIVE')
  const activeSubscriptionPlanIds = subscriptions
    .filter((sub) => sub.status !== 'CANCELLED')
    .map((sub) => sub.planId)

  const hasExtraCreditPlan = plans.some((p) => p.abacateProductId === EXTRA_CREDIT_ID)

  return (
    <Box sx={billingPageStyles}>
      <Box component="header" sx={headerRowStyles}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h3" component="h1" sx={pageTitleStyles}>
            Plano, créditos e transações
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie sua assinatura recorrente, adquira créditos avulsos e acompanhe todos os seus pagamentos.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          disabled={isLoadingTransactions || isLoadingInitial}
          onClick={handleRefreshAll}
          startIcon={
            isLoadingTransactions ? <CircularProgress size={18} color="inherit" /> : <RefreshIcon />
          }
          sx={headerButtonStyles}
        >
          Atualizar dados
        </Button>
      </Box>

      <BillingSummary
        paidCredits={user.paidCredits}
        freeCredits={user.freeCredits}
        freeTrialClaimed={Boolean(user.freeTrialClaimedAt)}
        activeSubscription={activeSubscription}
        purchases={purchases}
        isCheckingOutFreeTrial={checkoutPlanId === FREE_PLAN_ID}
        isCheckoutBusy={checkoutPlanId !== null}
        onClaimFreeTrial={() => startCheckout(FREE_PLAN_ID)}
      />

      <CurrentPlanCard
        subscriptions={subscriptions}
        cancellingId={cancellingSubscriptionId}
        checkoutPlanId={checkoutPlanId}
        hasExtraCreditPlan={hasExtraCreditPlan}
        onBuyExtraCredit={() => startCheckout(EXTRA_CREDIT_ID)}
        onCancelSubscription={handleCancelSubscription}
      />

      <CreditsAndPlans
        plans={plans}
        isLoading={isLoadingInitial}
        checkoutPlanId={checkoutPlanId}
        activeSubscriptionPlanIds={activeSubscriptionPlanIds}
        hasActiveSubscription={hasActiveSubscription}
        freeTrialClaimed={Boolean(user.freeTrialClaimedAt)}
        onSelectPlan={startCheckout}
      />

      <TransactionsHistory
        transactions={transactions}
        page={transactionsPage}
        total={transactionsTotal}
        totalPages={transactionsTotalPages}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        isLoading={isLoadingTransactions}
        onStatusFilterChange={handleStatusFilterChange}
        onTypeFilterChange={handleTypeFilterChange}
        onPageChange={handlePageChange}
        onSelectTransaction={setSelectedTransaction}
      />

      <TransactionDetailsDialog
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </Box>
  )
}

export default Billing
