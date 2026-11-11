import { Box, Button, Card, CircularProgress, Typography } from '@mui/material'

import { claimButtonStyles, kpiCardStyles, kpiGridStyles, kpiValueStyles, trialRowStyles } from './styles'
import useBillingPage from '@pages/app/billing/hook'

const BillingSummary = () => {
  const { paidCredits, freeCredits, freeTrialClaimed, isCheckingOutFreeTrial, isCheckoutBusy, handleClaimFreeTrial: onClaimFreeTrial } = useBillingPage()

  return (
    <Box component="section" sx={kpiGridStyles}>
      <Card elevation={0} sx={kpiCardStyles}>
        <Typography variant="caption" color="text.secondary" fontWeight={700}>
          CRÉDITOS DISPONÍVEIS
        </Typography>
        <Typography variant="h4" component="p" sx={kpiValueStyles}>
          {paidCredits}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {paidCredits === 1 ? 'Evento completo disponível' : 'Eventos completos disponíveis'}
        </Typography>
      </Card>

      <Card elevation={0} sx={kpiCardStyles}>
        <Typography variant="caption" color="text.secondary" fontWeight={700}>
          TESTE GRÁTIS
        </Typography>
        <Box sx={trialRowStyles}>
          <Typography variant="h4" component="p" sx={kpiValueStyles}>
            {freeCredits}
          </Typography>
          {!freeTrialClaimed && (
            <Button
              variant="outlined"
              size="small"
              disabled={isCheckoutBusy}
              onClick={onClaimFreeTrial}
              startIcon={isCheckingOutFreeTrial ? <CircularProgress size={14} color="inherit" /> : undefined}
              sx={claimButtonStyles}
            >
              {isCheckingOutFreeTrial ? 'Ativando...' : 'Resgatar grátis'}
            </Button>
          )}
        </Box>
        <Typography variant="caption" color="text.secondary">
          {freeTrialClaimed
            ? freeCredits > 0
              ? 'Teste grátis pronto para uso (até 25 fotos)'
              : 'Teste grátis já utilizado nesta conta'
            : '1 evento de teste grátis disponível'}
        </Typography>
      </Card>
    </Box>
  )
}

export default BillingSummary
