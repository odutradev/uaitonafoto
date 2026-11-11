import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";

import useBillingPage, { BillingPageProvider } from "./hook";
import BillingSummary from "./sections/billingSummary";
import CreditsAndPlans from "./sections/creditsAndPlans";
import CurrentPlanCard from "./sections/currentPlanCard";
import TransactionsHistory from "./sections/transactionsHistory";
import TransactionDetailsDialog from "./subcomponents/transactionDetailsDialog";
import CheckoutConfirmationDialog from "./subcomponents/checkoutConfirmationDialog";
import { billingPageStyles, headerButtonStyles, headerRowStyles, pageTitleStyles } from "./styles";

const BillingContent = () => {
  const { user, isLoadingInitial, isLoadingTransactions, handleRefreshAll } = useBillingPage();

  if (!user) return null;

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

      <BillingSummary />

      <CurrentPlanCard />

      <CreditsAndPlans />

      <TransactionsHistory />

      <TransactionDetailsDialog />

      <CheckoutConfirmationDialog />
    </Box>
  );
};

const Billing = () => (
  <BillingPageProvider>
    <BillingContent />
  </BillingPageProvider>
);

export default Billing;
