import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { ContentCopy as CopyIcon, OpenInNew as OpenIcon, ReceiptLong as ReceiptIcon } from '@mui/icons-material'
import { toast } from 'react-toastify'

import { formatPriceInBrl } from '@utils/functions/formatters'

import { dialogActionsStyles, dialogButtonStyles, dialogPaperStyles, metaRowStyles, metaStackStyles, monoIdStyles } from './styles'
import type { TransactionStatus } from '@utils/types/payments'
import useBillingPage from '@pages/app/billing/hook'

const formatDateTimePtBr = (isoDate?: string): string => {
  if (!isoDate) return '-'
  const parsed = new Date(isoDate)
  if (Number.isNaN(parsed.getTime())) return '-'
  return parsed.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusLabel = (status: TransactionStatus, cancelReason?: string) => {
  switch (status) {
    case 'PAID':
      return { label: 'Pago', color: 'success' as const }
    case 'PENDING':
      return { label: 'Aguardando pagamento', color: 'warning' as const }
    case 'REFUNDED':
      return { label: 'Reembolsado', color: 'info' as const }
    case 'DISPUTED':
      return { label: 'Em disputa', color: 'error' as const }
    case 'EXPIRED':
      return { label: 'Expirado', color: 'default' as const }
    case 'CANCELLED':
      if (cancelReason === 'cancelled_by_user') {
        return { label: 'Cancelado pelo usuário', color: 'default' as const }
      }
      return { label: 'Cancelado', color: 'default' as const }
    default:
      return { label: 'Cancelado', color: 'default' as const }
  }
}

const getPlanTypeLabel = (planType: string): string => {
  if (planType === 'SUBSCRIPTION') return 'Assinatura recorrente'
  if (planType === 'UPSELL') return 'Complemento'
  if (planType === 'FREE') return 'Teste grátis'
  return 'Compra avulsa'
}

const formatMethodLabel = (method?: string): string => {
  if (method === 'PIX') return 'PIX'
  if (method === 'CARD') return 'Cartão de Crédito'
  if (method === 'BOLETO') return 'Boleto'
  return 'Não informado'
}

const TransactionDetailsDialog = () => {
  const { selectedTransaction: transaction, handleCloseTransaction: onClose } = useBillingPage()

  if (!transaction) return null

  const statusMeta = getStatusLabel(transaction.status, transaction.cancelReason)
  const displayAmount = formatPriceInBrl(transaction.paidAmount ?? transaction.amount)

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(transaction.id)
      toast.info('ID da transação copiado!')
    } catch {
      toast.error('Não foi possível copiar o ID.')
    }
  }

  return (
    <Dialog open={Boolean(transaction)} onClose={onClose} slotProps={{ paper: { sx: dialogPaperStyles } }}>
      <DialogTitle>Detalhes da transação</DialogTitle>
      <DialogContent>
        <Box sx={metaStackStyles}>
          <Box sx={metaRowStyles}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              PRODUTO / PLANO
            </Typography>
            <Typography variant="body2" fontWeight={800}>
              {transaction.planName}
            </Typography>
          </Box>

          <Box sx={metaRowStyles}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              STATUS
            </Typography>
            <Chip size="small" color={statusMeta.color} label={statusMeta.label} sx={{ fontWeight: 700 }} />
          </Box>

          {transaction.status === 'CANCELLED' && (
            <Box sx={metaRowStyles}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                MOTIVO
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {transaction.cancelReason === 'cancelled_by_user'
                  ? 'Cancelado pelo usuário'
                  : 'Cancelado pelo gateway'}
              </Typography>
            </Box>
          )}

          <Box sx={metaRowStyles}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              MODALIDADE
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {getPlanTypeLabel(transaction.planType)}
            </Typography>
          </Box>

          <Box sx={metaRowStyles}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              VALOR
            </Typography>
            <Typography variant="body2" fontWeight={800}>
              {displayAmount}
            </Typography>
          </Box>

          <Box sx={metaRowStyles}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              MÉTODO DE PAGAMENTO
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {formatMethodLabel(transaction.paymentMethod)}
            </Typography>
          </Box>

          <Box sx={metaRowStyles}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              CRIADO EM
            </Typography>
            <Typography variant="body2">{formatDateTimePtBr(transaction.createdAt)}</Typography>
          </Box>

          {transaction.paidAt && (
            <Box sx={metaRowStyles}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                PAGO EM
              </Typography>
              <Typography variant="body2">{formatDateTimePtBr(transaction.paidAt)}</Typography>
            </Box>
          )}

          <Box sx={metaRowStyles}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              ID DA TRANSAÇÃO
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography sx={monoIdStyles}>{transaction.id}</Typography>
              <Tooltip title="Copiar ID">
                <IconButton size="small" onClick={handleCopyId} aria-label="Copiar ID da transação">
                  <CopyIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={dialogActionsStyles}>
        <Button variant="outlined" onClick={onClose} sx={dialogButtonStyles}>
          Fechar
        </Button>

        {transaction.status === 'PENDING' && transaction.checkoutUrl && (
          <Button
            component="a"
            href={transaction.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="primary"
            startIcon={<OpenIcon />}
            sx={dialogButtonStyles}
          >
            Concluir pagamento
          </Button>
        )}

        {transaction.receiptUrl && (
          <Button
            component="a"
            href={transaction.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="primary"
            startIcon={<ReceiptIcon />}
            sx={dialogButtonStyles}
          >
            Abrir recibo
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default TransactionDetailsDialog
