import { useState } from 'react'
import {
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
  Stack,
  Typography
} from '@mui/material'

import { formatPriceInBrl } from '@config/formatters'

import {
  cancelButtonStyles,
  dialogActionsStyles,
  dialogButtonStyles,
  dialogPaperStyles,
  infoBoxStyles,
  listStackStyles,
  planNameStyles,
  sectionTitleStyles,
  statusChipStyles,
  subscriptionCardStyles,
  titleRowStyles
} from './styles'
import type { SubscriptionItem, SubscriptionStatus } from '@actions/payments/types'
import type { SubscriptionsProps } from './types'

const formatDatePtBr = (isoDate?: string): string | null => {
  if (!isoDate) return null
  const parsed = new Date(isoDate)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toLocaleDateString('pt-BR')
}

const getStatusChipProps = (status: SubscriptionStatus) => {
  if (status === 'ACTIVE') return { label: 'Ativa', color: 'success' as const, variant: 'filled' as const }
  if (status === 'PAST_DUE') return { label: 'Pagamento pendente', color: 'warning' as const, variant: 'filled' as const }
  return { label: 'Cancelada', color: 'default' as const, variant: 'outlined' as const }
}

const Subscriptions = ({ subscriptions, cancellingId, onCancelSubscription }: SubscriptionsProps) => {
  const [confirmTarget, setConfirmTarget] = useState<SubscriptionItem | null>(null)

  if (subscriptions.length === 0) return null

  const isCancelling = cancellingId !== null

  const handleConfirmCancel = async () => {
    if (!confirmTarget) return
    const succeeded = await onCancelSubscription(confirmTarget.id)
    if (succeeded) setConfirmTarget(null)
  }

  return (
    <Box id="assinaturas" component="section">
      <Typography variant="h5" component="h2" sx={sectionTitleStyles}>
        Minhas assinaturas
      </Typography>

      <Stack sx={listStackStyles}>
        {subscriptions.map((sub) => {
          const chipProps = getStatusChipProps(sub.status)
          const isCurrentCancelling = cancellingId === sub.id
          const nextBillingFormatted = formatDatePtBr(sub.nextBillingAt)
          const cancelledFormatted = formatDatePtBr(sub.cancelledAt)

          return (
            <Card key={sub.id} elevation={0} sx={subscriptionCardStyles}>
              <Box sx={infoBoxStyles}>
                <Box sx={titleRowStyles}>
                  <Typography variant="h6" component="h3" sx={planNameStyles}>
                    {sub.planName}
                  </Typography>
                  <Chip
                    size="small"
                    label={chipProps.label}
                    color={chipProps.color}
                    variant={chipProps.variant}
                    sx={statusChipStyles}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary">
                  {formatPriceInBrl(sub.amount)}/mês • {sub.creditsPerCycle}{' '}
                  {sub.creditsPerCycle === 1 ? 'crédito mensal' : 'créditos mensais'}
                </Typography>

                {sub.status !== 'CANCELLED' && nextBillingFormatted && (
                  <Typography variant="caption" color="text.secondary">
                    Próxima renovação estimada em {nextBillingFormatted}
                  </Typography>
                )}

                {sub.status === 'CANCELLED' && cancelledFormatted && (
                  <Typography variant="caption" color="text.secondary">
                    Assinatura encerrada em {cancelledFormatted}
                  </Typography>
                )}
              </Box>

              {sub.status !== 'CANCELLED' && (
                <Button
                  variant="outlined"
                  color="error"
                  disabled={isCancelling}
                  onClick={() => setConfirmTarget(sub)}
                  startIcon={isCurrentCancelling ? <CircularProgress size={18} color="inherit" /> : undefined}
                  sx={cancelButtonStyles}
                >
                  {isCurrentCancelling ? 'Cancelando...' : 'Cancelar recorrência'}
                </Button>
              )}
            </Card>
          )
        })}
      </Stack>

      <Dialog
        open={Boolean(confirmTarget)}
        onClose={isCancelling ? undefined : () => setConfirmTarget(null)}
        slotProps={{ paper: { sx: dialogPaperStyles } }}
      >
        <DialogTitle>Cancelar assinatura recorrente?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ao cancelar o plano <strong>{confirmTarget?.planName}</strong>, nenhuma nova cobrança mensal será realizada.
            Os créditos já adicionados na sua conta continuam disponíveis normalmente.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={dialogActionsStyles}>
          <Button
            variant="outlined"
            disabled={isCancelling}
            onClick={() => setConfirmTarget(null)}
            sx={dialogButtonStyles}
          >
            Manter assinatura
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={isCancelling}
            onClick={handleConfirmCancel}
            startIcon={isCancelling ? <CircularProgress size={18} color="inherit" /> : undefined}
            sx={dialogButtonStyles}
          >
            {isCancelling ? 'Cancelando...' : 'Confirmar cancelamento'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Subscriptions

