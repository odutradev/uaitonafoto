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
  Stack,
  Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { AddShoppingCart as ExtraCreditIcon } from '@mui/icons-material'

import { formatPriceInBrl } from '@pages/public/landingPage/sections/plans/utils'

import {
  actionsBarStyles,
  activePlanCardStyles,
  buttonResponsiveStyles,
  cancelledItemStyles,
  detailsGridStyles,
  detailTileStyles,
  dialogActionsStyles,
  dialogPaperStyles,
  emptyPlanCardStyles,
  sectionBoxStyles,
  titleChipsRowStyles,
  topHeaderRowStyles
} from './styles'
import type { SubscriptionItem, SubscriptionStatus } from '@actions/payments/types'
import type { CurrentPlanCardProps } from './types'

const EXTRA_CREDIT_PLAN_ID = 'prod_agency_extra_credit'

const formatDatePtBr = (isoDate?: string): string => {
  if (!isoDate) return '-'
  const parsed = new Date(isoDate)
  if (Number.isNaN(parsed.getTime())) return '-'
  return parsed.toLocaleDateString('pt-BR')
}

const formatMethodLabel = (method?: string): string => {
  if (method === 'PIX') return 'PIX Recorrente'
  if (method === 'CARD') return 'Cartão de Crédito'
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
  checkoutPlanId,
  hasExtraCreditPlan,
  onBuyExtraCredit,
  onCancelSubscription
}: CurrentPlanCardProps) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [confirmTarget, setConfirmTarget] = useState<SubscriptionItem | null>(null)

  const currentSubscriptions = subscriptions.filter((sub) => sub.status !== 'CANCELLED')
  const cancelledSubscriptions = subscriptions.filter((sub) => sub.status === 'CANCELLED')

  const isCancelling = cancellingId !== null
  const isBuyingExtra = checkoutPlanId === EXTRA_CREDIT_PLAN_ID

  const handleConfirmCancel = async () => {
    if (!confirmTarget) return
    const ok = await onCancelSubscription(confirmTarget.id)
    if (ok) setConfirmTarget(null)
  }

  return (
    <Box component="section" sx={sectionBoxStyles}>
      <Typography variant="h5" component="h2">
        Assinatura e plano recorrente
      </Typography>

      {currentSubscriptions.length === 0 && (
        <Card elevation={0} sx={emptyPlanCardStyles}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" component="h3">
              Você não possui assinatura mensal ativa
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sua conta opera sob demanda. Você pode comprar créditos avulsos quando precisar ou assinar um plano Agência abaixo para economizar até 70% por evento.
            </Typography>
          </Box>
          <Button
            component="a"
            href="#loja-creditos"
            variant="outlined"
            sx={buttonResponsiveStyles}
          >
            Ver opções de planos
          </Button>
        </Card>
      )}

      {currentSubscriptions.map((sub) => {
        const statusProps = getStatusProps(sub.status)
        const isThisCancelling = cancellingId === sub.id

        return (
          <Card key={sub.id} elevation={0} sx={activePlanCardStyles(isDark)}>
            <Box sx={topHeaderRowStyles}>
              <Box sx={titleChipsRowStyles}>
                <Typography variant="h5" component="h3">
                  {sub.planName}
                </Typography>
                <Chip size="small" color={statusProps.color} label={statusProps.label} sx={{ fontWeight: 700 }} />
              </Box>

              <Typography variant="h5" fontWeight={800}>
                {formatPriceInBrl(sub.amount)}
                <Typography component="span" variant="body2" color="text.secondary">
                  /mês
                </Typography>
              </Typography>
            </Box>

            {sub.status === 'PAST_DUE' && (
              <Alert severity="warning" sx={{ borderRadius: '14px' }}>
                Identificamos uma pendência na última renovação. Eventos já ativados nunca são interrompidos, mas regularize sua assinatura para liberar novos ciclos.
              </Alert>
            )}

            <Box sx={detailsGridStyles}>
              <Box sx={detailTileStyles}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  FRANQUIA POR CICLO
                </Typography>
                <Typography variant="body1" fontWeight={800}>
                  {sub.creditsPerCycle} {sub.creditsPerCycle === 1 ? 'evento/mês' : 'eventos/mês'}
                </Typography>
              </Box>

              <Box sx={detailTileStyles}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  PRÓXIMA COBRANÇA
                </Typography>
                <Typography variant="body1" fontWeight={800}>
                  {formatDatePtBr(sub.nextBillingAt)}
                </Typography>
              </Box>

              <Box sx={detailTileStyles}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  ÚLTIMO PAGAMENTO
                </Typography>
                <Typography variant="body1" fontWeight={800}>
                  {formatDatePtBr(sub.lastPaidAt)}
                </Typography>
              </Box>

              <Box sx={detailTileStyles}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  FORMA DE COBRANÇA
                </Typography>
                <Typography variant="body1" fontWeight={800}>
                  {formatMethodLabel(sub.method)} ({sub.cyclesCompleted}x)
                </Typography>
              </Box>
            </Box>

            <Box sx={actionsBarStyles}>
              {sub.status === 'ACTIVE' && hasExtraCreditPlan ? (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={checkoutPlanId !== null || isCancelling}
                  onClick={onBuyExtraCredit}
                  startIcon={
                    isBuyingExtra ? <CircularProgress size={18} color="inherit" /> : <ExtraCreditIcon />
                  }
                  sx={buttonResponsiveStyles}
                >
                  {isBuyingExtra ? 'Abrindo checkout...' : 'Comprar crédito extra de assinante'}
                </Button>
              ) : (
                <Box />
              )}

              <Button
                variant="outlined"
                color="error"
                disabled={isCancelling || checkoutPlanId !== null}
                onClick={() => setConfirmTarget(sub)}
                startIcon={isThisCancelling ? <CircularProgress size={18} color="inherit" /> : undefined}
                sx={buttonResponsiveStyles}
              >
                {isThisCancelling ? 'Cancelando...' : 'Cancelar plano recorrente'}
              </Button>
            </Box>
          </Card>
        )
      })}

      {cancelledSubscriptions.length > 0 && (
        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
            Assinaturas encerradas anteriormente
          </Typography>
          {cancelledSubscriptions.map((sub) => (
            <Card key={sub.id} elevation={0} sx={cancelledItemStyles}>
              <Box>
                <Typography variant="body2" fontWeight={700}>
                  {sub.planName} • {formatPriceInBrl(sub.amount)}/mês
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Cancelada em {formatDatePtBr(sub.cancelledAt)} • {sub.cyclesCompleted}{' '}
                  {sub.cyclesCompleted === 1 ? 'ciclo concluído' : 'ciclos concluídos'}
                </Typography>
              </Box>
              <Chip size="small" variant="outlined" label="Cancelada" />
            </Card>
          ))}
        </Stack>
      )}

      <Dialog
        open={Boolean(confirmTarget)}
        onClose={isCancelling ? undefined : () => setConfirmTarget(null)}
        slotProps={{ paper: { sx: dialogPaperStyles } }}
      >
        <DialogTitle>Cancelar plano recorrente?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ao cancelar o plano <strong>{confirmTarget?.planName}</strong>, nenhuma nova mensalidade será cobrada nos próximos ciclos.
            Todos os créditos já liberados na sua conta e eventos em andamento permanecem funcionando normalmente.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={dialogActionsStyles}>
          <Button
            variant="outlined"
            disabled={isCancelling}
            onClick={() => setConfirmTarget(null)}
            sx={buttonResponsiveStyles}
          >
            Manter meu plano
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={isCancelling}
            onClick={handleConfirmCancel}
            startIcon={isCancelling ? <CircularProgress size={18} color="inherit" /> : undefined}
            sx={buttonResponsiveStyles}
          >
            {isCancelling ? 'Cancelando...' : 'Confirmar cancelamento'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CurrentPlanCard
