import {
  Box,
  Button,
  Card,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Skeleton,
  Stack,
  Typography
} from '@mui/material'
import { OpenInNew as PayNowIcon } from '@mui/icons-material'

import { formatPriceInBrl } from '@pages/public/landingPage/sections/plans/utils'

import {
  batchesCardStyles,
  batchItemRowStyles,
  emptyBoxStyles,
  filterSelectStyles,
  filtersRowStyles,
  getListCardStyles,
  getTransactionRowStyles,
  headerFilterBarStyles,
  historyWrapperStyles,
  paginationRowStyles,
  rowActionsStyles,
  rowButtonStyles,
  rowMainInfoStyles,
  rowRightColStyles,
  rowTitleBadgesStyles
} from './styles'
import type { TransactionStatus } from '@actions/payments/types'
import type { TransactionStatusFilter, TransactionTypeFilter } from '../../types'
import type { TransactionsHistoryProps } from './types'

const formatShortDatePtBr = (isoDate?: string): string | null => {
  if (!isoDate) return null
  const parsed = new Date(isoDate)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toLocaleDateString('pt-BR')
}

const formatDatePtBr = (isoDate?: string): string => {
  if (!isoDate) return '-'
  const parsed = new Date(isoDate)
  if (Number.isNaN(parsed.getTime())) return '-'
  return parsed.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusBadge = (status: TransactionStatus) => {
  switch (status) {
    case 'PAID':
      return { label: 'Pago', color: 'success' as const }
    case 'PENDING':
      return { label: 'Pendente', color: 'warning' as const }
    case 'REFUNDED':
      return { label: 'Reembolsado', color: 'info' as const }
    case 'DISPUTED':
      return { label: 'Em disputa', color: 'error' as const }
    case 'EXPIRED':
      return { label: 'Expirado', color: 'default' as const }
    case 'CANCELLED':
    default:
      return { label: 'Cancelado', color: 'default' as const }
  }
}

const getTypeLabel = (planType: string): string => {
  if (planType === 'SUBSCRIPTION') return 'Mensalidade'
  if (planType === 'UPSELL') return 'Complemento'
  return 'Avulso'
}

const formatMethodLabel = (method?: string): string | null => {
  if (method === 'PIX') return 'PIX'
  if (method === 'CARD') return 'Cartão'
  if (method === 'BOLETO') return 'Boleto'
  return null
}

const TransactionsHistory = ({
  purchases,
  transactions,
  page,
  total,
  totalPages,
  statusFilter,
  typeFilter,
  isLoading,
  onStatusFilterChange,
  onTypeFilterChange,
  onPageChange,
  onSelectTransaction
}: TransactionsHistoryProps) => {
  const activeBatches = purchases.filter(
    (item) => item.remainingCredits > 0 || item.extraStorageDays > 0
  )

  return (
    <Box id="transacoes" component="section" sx={historyWrapperStyles}>
      <Box sx={headerFilterBarStyles}>
        <Box>
          <Typography variant="h6" component="h2">
            Transações
          </Typography>
          {total > 0 && (
            <Typography variant="caption" color="text.secondary">
              {total} {total === 1 ? 'registro' : 'registros'}
            </Typography>
          )}
        </Box>

        <Box sx={filtersRowStyles}>
          <FormControl size="small" sx={filterSelectStyles}>
            <InputLabel id="tx-status-filter-label">Status</InputLabel>
            <Select
              labelId="tx-status-filter-label"
              label="Status"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as TransactionStatusFilter)}
            >
              <MenuItem value="ALL">Todos</MenuItem>
              <MenuItem value="PAID">Pagos</MenuItem>
              <MenuItem value="PENDING">Pendentes</MenuItem>
              <MenuItem value="CANCELLED">Cancelados</MenuItem>
              <MenuItem value="EXPIRED">Expirados</MenuItem>
              <MenuItem value="REFUNDED">Reembolsados</MenuItem>
              <MenuItem value="DISPUTED">Em disputa</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={filterSelectStyles}>
            <InputLabel id="tx-type-filter-label">Modalidade</InputLabel>
            <Select
              labelId="tx-type-filter-label"
              label="Modalidade"
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value as TransactionTypeFilter)}
            >
              <MenuItem value="ALL">Todas</MenuItem>
              <MenuItem value="SUBSCRIPTION">Assinatura</MenuItem>
              <MenuItem value="ONE_TIME">Avulso</MenuItem>
              <MenuItem value="UPSELL">Complemento</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {activeBatches.length > 0 && (
        <Card elevation={0} sx={batchesCardStyles}>
          <Typography variant="subtitle2" fontWeight={700}>
            Lotes de créditos e complementos ativos
          </Typography>
          <Stack spacing={1}>
            {activeBatches.slice(0, 5).map((batch) => {
              const expiresFormatted = formatShortDatePtBr(batch.creditsExpiresAt)
              const acquiredFormatted = formatShortDatePtBr(batch.createdAt)

              return (
                <Box key={batch.id} sx={batchItemRowStyles}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={700}>
                      {batch.planName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Adquirido em {acquiredFormatted ?? '-'}
                      {expiresFormatted ? ` • Válido até ${expiresFormatted}` : ''}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={0.75} flexWrap="wrap">
                    {batch.remainingCredits > 0 && (
                      <Chip
                        size="small"
                        color={batch.creditType === 'paid' ? 'primary' : 'default'}
                        label={`${batch.remainingCredits}/${batch.credits} disp.`}
                        sx={{ fontWeight: 700, height: 22 }}
                      />
                    )}
                    {batch.extraStorageDays > 0 && (
                      <Chip
                        size="small"
                        variant="outlined"
                        label={`+${batch.extraStorageDays} dias de galeria`}
                        sx={{ height: 22 }}
                      />
                    )}
                  </Stack>
                </Box>
              )
            })}
          </Stack>
        </Card>
      )}

      {isLoading && transactions.length === 0 && (
        <Stack spacing={1}>
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} variant="rounded" height={68} sx={{ borderRadius: '16px' }} />
          ))}
        </Stack>
      )}

      {!isLoading && transactions.length === 0 && (
        <Paper elevation={0} sx={emptyBoxStyles}>
          <Typography variant="subtitle1" fontWeight={700}>
            Nenhuma transação encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Seus pagamentos aparecerão aqui assim que forem gerados.
          </Typography>
        </Paper>
      )}

      {transactions.length > 0 && (
        <Card elevation={0} sx={getListCardStyles(isLoading)}>
          {transactions.map((item, index) => {
            const statusBadge = getStatusBadge(item.status)
            const amountFormatted = formatPriceInBrl(item.paidAmount ?? item.amount)
            const methodLabel = formatMethodLabel(item.paymentMethod)
            const referenceDate = formatDatePtBr(item.paidAt ?? item.createdAt)
            const isLast = index === transactions.length - 1

            return (
              <Box key={item.id} sx={getTransactionRowStyles(isLast)}>
                <Box sx={rowMainInfoStyles}>
                  <Box sx={rowTitleBadgesStyles}>
                    <Typography variant="body2" fontWeight={700}>
                      {item.planName}
                    </Typography>
                    <Chip
                      size="small"
                      color={statusBadge.color}
                      label={statusBadge.label}
                      sx={{ fontWeight: 700, height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    {referenceDate} • {getTypeLabel(item.planType)}
                    {methodLabel ? ` • ${methodLabel}` : ''}
                  </Typography>
                </Box>

                <Box sx={rowRightColStyles}>
                  <Typography variant="body2" fontWeight={800}>
                    {amountFormatted}
                  </Typography>

                  <Box sx={rowActionsStyles}>
                    {item.status === 'PENDING' && item.checkoutUrl && (
                      <Button
                        component="a"
                        href={item.checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        color="primary"
                        size="small"
                        endIcon={<PayNowIcon sx={{ fontSize: 14 }} />}
                        sx={rowButtonStyles}
                      >
                        Pagar
                      </Button>
                    )}

                    {item.receiptUrl && (
                      <Button
                        component="a"
                        href={item.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        size="small"
                        sx={rowButtonStyles}
                      >
                        Recibo
                      </Button>
                    )}

                    <Button
                      variant="text"
                      size="small"
                      onClick={() => onSelectTransaction(item)}
                      sx={rowButtonStyles}
                    >
                      Detalhes
                    </Button>
                  </Box>
                </Box>
              </Box>
            )
          })}
        </Card>
      )}

      {totalPages > 1 && (
        <Box sx={paginationRowStyles}>
          <Pagination
            count={totalPages}
            page={page}
            disabled={isLoading}
            color="primary"
            size="small"
            shape="rounded"
            onChange={(_e, nextPage) => onPageChange(nextPage)}
          />
        </Box>
      )}
    </Box>
  )
}

export default TransactionsHistory
