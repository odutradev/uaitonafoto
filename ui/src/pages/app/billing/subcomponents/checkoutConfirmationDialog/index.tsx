import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  LockOutlined as LockIcon,
  ShieldOutlined as ShieldIcon
} from '@mui/icons-material'

import { formatPriceInBrl } from '@config/formatters'

import {
  cancelButtonStyles,
  checkIconStyles,
  confirmButtonStyles,
  confirmationDialogPaperStyles,
  dialogActionsStyles,
  dialogContentBoxStyles,
  featureRowStyles,
  featuresContainerStyles,
  noticeBoxStyles,
  planSummaryCardStyles,
  priceRowStyles,
  priceValueStyles
} from './styles'
import type { CheckoutConfirmationDialogProps } from './types'

export const CheckoutConfirmationDialog = ({
  plan,
  open,
  isLoading,
  onClose,
  onConfirm
}: CheckoutConfirmationDialogProps) => {
  if (!plan) return null

  const formattedPrice = formatPriceInBrl(plan.price)
  const isSubscription = plan.type === 'SUBSCRIPTION'
  const periodText = plan.period || (isSubscription ? '/mês' : 'pagamento único')
  const planCreditsLabel = plan.credits > 0 ? `+${plan.credits} ${plan.credits === 1 ? 'crédito' : 'créditos'}` : null

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      slotProps={{ paper: { sx: confirmationDialogPaperStyles } }}
    >
      <DialogTitle sx={{ pb: 1, pt: 3, px: 3, fontWeight: 800 }}>
        Confirmar pedido
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Revise os detalhes da contratação antes de prosseguir para o pagamento seguro.
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 1 }}>
        <Box sx={dialogContentBoxStyles}>
          <Box sx={planSummaryCardStyles}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="h6" component="h3" fontWeight={800}>
                {plan.title || plan.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                {plan.tag && (
                  <Chip
                    size="small"
                    label={plan.tag}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 700, height: 22 }}
                  />
                )}
                {planCreditsLabel && (
                  <Chip
                    size="small"
                    label={planCreditsLabel}
                    color="primary"
                    sx={{ fontWeight: 700, height: 22 }}
                  />
                )}
              </Box>
            </Box>

            <Box sx={priceRowStyles}>
              <Typography component="span" sx={priceValueStyles}>
                {formattedPrice}
              </Typography>
              <Typography component="span" variant="body2" color="text.secondary" fontWeight={600}>
                {periodText}
              </Typography>
            </Box>

            {plan.costPerEvent && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                {plan.costPerEvent}
              </Typography>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {plan.description}
            </Typography>

            {Array.isArray(plan.features) && plan.features.length > 0 && (
              <Box sx={featuresContainerStyles}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                  O que está incluso:
                </Typography>
                {plan.features.map((feature, idx) => (
                  <Box key={idx} sx={featureRowStyles}>
                    <CheckCircleIcon sx={checkIconStyles} />
                    <Typography variant="body2" color="text.primary">
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Box sx={noticeBoxStyles}>
            <ShieldIcon color="primary" sx={{ fontSize: 22, mt: 0.25 }} />
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                Ambiente de pagamento seguro
              </Typography>
              <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 0.25 }}>
                Ao confirmar, você será direcionado ao checkout oficial da <strong>AbacatePay</strong> para escolher entre <strong>PIX</strong> ou <strong>Cartão de Crédito</strong> com total segurança.
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions disableSpacing sx={dialogActionsStyles}>
        <Button
          variant="outlined"
          color="inherit"
          disabled={isLoading}
          onClick={onClose}
          sx={cancelButtonStyles}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          disabled={isLoading}
          onClick={onConfirm}
          startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <LockIcon fontSize="small" />}
          sx={confirmButtonStyles}
        >
          {isLoading ? 'Gerando checkout...' : 'Confirmar e ir para pagamento'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CheckoutConfirmationDialog
