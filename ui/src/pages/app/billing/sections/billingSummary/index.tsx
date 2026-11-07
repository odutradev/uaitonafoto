import { Box, Button, Card, CircularProgress, Typography } from '@mui/material'
import {
  AutoAwesomeOutlined as SparklesIcon,
  CardGiftcardOutlined as GiftIcon,
  WorkspacePremiumOutlined as PlanIcon
} from '@mui/icons-material'

import {
  claimButtonStyles,
  kpiCardStyles,
  kpiGridStyles,
  kpiHeaderRowStyles,
  kpiValueStyles,
  summaryWrapperStyles
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
    <Box component="section" sx={summaryWrapperStyles}>
      <Box sx={kpiGridStyles}>
        <Card elevation={0} sx={kpiCardStyles}>
          <Box sx={kpiHeaderRowStyles}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              CRÉDITOS COMPLETOS
            </Typography>
            <SparklesIcon color="primary" fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h4" component="p" sx={kpiValueStyles}>
              {paidCredits} {paidCredits === 1 ? 'evento' : 'eventos'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Fotos ilimitadas, modo telão liberado e download em alta resolução.
            </Typography>
          </Box>
        </Card>

        <Card elevation={0} sx={kpiCardStyles}>
          <Box sx={kpiHeaderRowStyles}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              MODO DEGUSTAÇÃO
            </Typography>
            <GiftIcon color="action" fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h4" component="p" sx={kpiValueStyles}>
              {freeCredits} {freeCredits === 1 ? 'crédito grátis' : 'créditos grátis'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {freeTrialClaimed
                ? 'Degustação já ativada nesta conta (até 25 fotos).'
                : 'Você tem direito a 1 evento grátis para testar a plataforma.'}
            </Typography>
          </Box>

          {!freeTrialClaimed && (
            <Button
              variant="outlined"
              size="small"
              disabled={isCheckoutBusy}
              onClick={onClaimFreeTrial}
              startIcon={isCheckingOutFreeTrial ? <CircularProgress size={16} color="inherit" /> : undefined}
              sx={claimButtonStyles}
            >
              {isCheckingOutFreeTrial ? 'Ativando...' : 'Resgatar crédito grátis'}
            </Button>
          )}
        </Card>

        <Card elevation={0} sx={kpiCardStyles}>
          <Box sx={kpiHeaderRowStyles}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              PLANO ATUAL
            </Typography>
            <PlanIcon color={activeSubscription ? 'primary' : 'action'} fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h5" component="p" fontWeight={800} sx={{ lineHeight: 1.2 }}>
              {activeSubscription ? activeSubscription.planName : 'Modo Avulso'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {activeSubscription
                ? `${activeSubscription.creditsPerCycle} créditos/mês • ${
                    activeSubscription.status === 'ACTIVE' ? 'Assinatura em dia' : 'Pagamento pendente'
                  }`
                : 'Sem cobrança mensal recorrente. Compre créditos sob demanda ou assine.'}
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  )
}

export default BillingSummary
