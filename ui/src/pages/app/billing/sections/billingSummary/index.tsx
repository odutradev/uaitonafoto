import { Box, Button, Card, CircularProgress, Typography } from '@mui/material'

import {
  claimButtonStyles,
  kpiCardStyles,
  kpiGridStyles,
  kpiValueStyles,
  trialRowStyles
} from './styles'
import type { BillingSummaryProps } from './types'

const BillingSummary = ({
  paidCredits,
  freeCredits,
  freeTrialClaimed,
  activeSubscription,
  isCheckingOutFreeTrial,
  isCheckoutBusy,
  onClaimFreeTrial
}: BillingSummaryProps) => {
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

      <Card elevation={0} sx={kpiCardStyles}>
        <Typography variant="caption" color="text.secondary" fontWeight={700}>
          ASSINATURA ATUAL
        </Typography>
        <Typography variant="h6" component="p" fontWeight={800} sx={{ lineHeight: 1.2 }}>
          {activeSubscription ? activeSubscription.planName : 'Sem plano ativo'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {activeSubscription
            ? `${activeSubscription.creditsPerCycle} eventos/mês • ${
                activeSubscription.status === 'ACTIVE' ? 'Em dia' : 'Pagamento pendente'
              }`
            : 'Modo avulso sob demanda'}
        </Typography>
      </Card>
    </Box>
  )
}

export default BillingSummary
