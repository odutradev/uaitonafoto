import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from '@mui/material'

import { formatPriceInBrl } from '@pages/public/landingPage/sections/plans/utils'

import {
  activePlanCardStyles,
  cancelButtonStyles,
  dialogActionsStyles,
  dialogButtonStyles,
  dialogPaperStyles,
  metaItemsStyles,
  metaRowStyles,
  sectionBoxStyles,
  titleChipsRowStyles,
  topHeaderRowStyles
} from './styles'
import type { SubscriptionItem, SubscriptionStatus } from '@actions/payments/types'
import type { CurrentPlanCardProps } from './types'

const formatDatePtBr = (isoDate?: string): string => {
  if (!isoDate) return '-'
  const parsed = new Date(isoDate)
  if (Number.isNaN(parsed.getTime())) return '-'
  return parsed.toLocaleDateString('pt-BR')
}

const formatMethodLabel = (method?: string): string => {
  if (method === 'PIX') return 'PIX'
  if (method === 'CARD') return 'Cartão'
  return 'Automático'
}

const getStatusProps = (status: SubscriptionStatus) => {
  if (status === 'ACTIVE') return { label: 'Ativa', color: 'success' as const }
  if (status === 'PAST_DUE') return { label: 'Pagamento pendente', color: 'warning' as const }
  return { label: 'Cancelada', color: 'default' as const }
}

const CurrentPlanCard = ({
  subscriptions,
  cancellingId,
  isCheckoutBusy,
  onCancelSubscription
}: CurrentPlanCardProps) => {
  const [confirmTarget, setConfirmTarget] = useState<SubscriptionItem | null>(null)

  const currentSubscriptions = subscriptions.filter((sub) => sub.status !== 'CANCELLED')
  const isCancelling = cancellingId !== null

  const handleConfirmCancel = async () => {
    if (!confirmTarget) return
    const ok = await onCancelSubscription(confirmTarget.id)
    if (ok) setConfirmTarget(null)
  }

  if (currentSubscriptions.length === 0) {
    return null
  }

  return (
    <Box component="section" sx={sectionBoxStyles}>
      {currentSubscriptions.map((sub) => {
        const statusProps = getStatusProps(sub.status)
        const isThisCancelling = cancellingId === sub.id

        return (
          <Card key={sub.id} elevation={0} sx={activePlanCardStyles}>
            <Box sx={topHeaderRowStyles}>
              <Box sx={titleChipsRowStyles}>
                <Typography variant="subtitle1" component="h2" fontWeight={800}>
                  {sub.planName}
                </Typography>
                <Chip size="small" color={statusProps.color} label={statusProps.label} sx={{ fontWeight: 700 }} />
              </Box>

              <Typography variant="subtitle1" fontWeight={800}>
                {formatPriceInBrl(sub.amount)}
                <Typography component="span" variant="body2" color="text.secondary">
                  /mês
                </Typography>
              </Typography>
            </Box>

            {sub.status === 'PAST_DUE' && (
              <Alert severity="warning" sx={{ borderRadius: '12px', py: 0.5 }}>
                Pendência na renovação. Regularize o pagamento para liberar os próximos ciclos.
              </Alert>
            )}

            <Box sx={metaRowStyles}>
              <Box sx={metaItemsStyles}>
                <Typography variant="body2" color="text.secondary">
                  Franquia: <strong>{sub.creditsPerCycle} eventos/mês</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Próxima cobrança: <strong>{formatDatePtBr(sub.nextBillingAt)}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cobrança: <strong>{formatMethodLabel(sub.method)}</strong>
                </Typography>
              </Box>

              <Button
                variant="text"
                color="error"
                size="small"
                disabled={isCancelling || isCheckoutBusy}
                onClick={() => setConfirmTarget(sub)}
                startIcon={isThisCancelling ? <CircularProgress size={14} color="inherit" /> : undefined}
                sx={cancelButtonStyles}
              >
                {isThisCancelling ? 'Cancelando...' : 'Cancelar assinatura'}
              </Button>
            </Box>
          </Card>
        )
      })}

      <Dialog
        open={Boolean(confirmTarget)}
        onClose={isCancelling ? undefined : () => setConfirmTarget(null)}
        slotProps={{ paper: { sx: dialogPaperStyles } }}
      >
        <DialogTitle>Cancelar assinatura?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ao cancelar <strong>{confirmTarget?.planName}</strong>, novas mensalidades não serão cobradas.
            Seus créditos atuais e eventos ativos continuam disponíveis normalmente.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={dialogActionsStyles}>
          <Button
            variant="outlined"
            disabled={isCancelling}
            onClick={() => setConfirmTarget(null)}
            sx={dialogButtonStyles}
          >
            Manter plano
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={isCancelling}
            onClick={handleConfirmCancel}
            startIcon={isCancelling ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={dialogButtonStyles}
          >
            {isCancelling ? 'Cancelando...' : 'Confirmar cancelamento'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CurrentPlanCard
