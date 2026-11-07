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
  Typography
} from '@mui/material'
import {
  InfoOutlined as DetailsIcon,
  OpenInNew as PayNowIcon,
  ReceiptLong as ReceiptIcon
} from '@mui/icons-material'

import { formatPriceInBrl } from '@pages/public/landingPage/sections/plans/utils'

import {
  emptyBoxStyles,
  filterSelectStyles,
  filtersRowStyles,
  getListContainerStyles,
  headerFilterBarStyles,
  historyWrapperStyles,
  paginationRowStyles,
  rowActionsStyles,
  rowButtonStyles,
  rowMainInfoStyles,
  rowTitleBadgesStyles,
  transactionRowCardStyles
} from './styles'
import type { TransactionStatus } from '@actions/payments/types'
import type { TransactionStatusFilter, TransactionTypeFilter } from '../../types'
import type { TransactionsHistoryProps } from './types'

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
  return (
    <Box id="transacoes" component="section" sx={historyWrapperStyles}>
      <Box sx={headerFilterBarStyles}>
        <Box>
          <Typography variant="h5" component="h2">
            Histórico de pagamentos e transações
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {total} {total === 1 ? 'registro encontrado' : 'registros encontrados'} na sua conta.
          </Typography>
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
              <MenuItem value="ALL">Todos os status</MenuItem>
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
              <MenuItem value="ALL">Todas as modalidades</MenuItem>
              <MenuItem value="SUBSCRIPTION">Assinatura mensal</MenuItem>
              <MenuItem value="ONE_TIME">Crédito avulso</MenuItem>
              <MenuItem value="UPSELL">Complemento</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {isLoading && transactions.length === 0 && (
        <Box sx={getListContainerStyles(false)}>
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} variant="rounded" height={96} sx={{ borderRadius: '20px' }} />
          ))}
        </Box>
      )}

      {!isLoading && transactions.length === 0 && (
        <Paper elevation={0} sx={emptyBoxStyles}>
          <Typography variant="h6" component="h3">
            Nenhuma transação encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Não há pagamentos correspondentes aos filtros selecionados no momento.
          </Typography>
        </Paper>
      )}

      {transactions.length > 0 && (
        <Box sx={getListContainerStyles(isLoading)}>
          {transactions.map((item) => {
            const statusBadge = getStatusBadge(item.status)
            const amountFormatted = formatPriceInBrl(item.paidAmount ?? item.amount)
            const methodLabel = formatMethodLabel(item.paymentMethod)
            const referenceDate = formatDatePtBr(item.paidAt ?? item.createdAt)

            return (
              <Card key={item.id} elevation={0} sx={transactionRowCardStyles}>
                <Box sx={rowMainInfoStyles}>
                  <Box sx={rowTitleBadgesStyles}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {item.planName}
                    </Typography>
                    <Chip
                      size="small"
                      variant="outlined"
                      label={getTypeLabel(item.planType)}
                    />
                    <Chip
                      size="small"
                      color={statusBadge.color}
                      label={statusBadge.label}
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    <strong>{amountFormatted}</strong> • {item.paidAt ? `Pago em ${referenceDate}` : `Criado em ${referenceDate}`}
                    {methodLabel ? ` • ${methodLabel}` : ''}
                  </Typography>
                </Box>

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
                      startIcon={<PayNowIcon />}
                      sx={rowButtonStyles}
                    >
                      Pagar agora
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
                      startIcon={<ReceiptIcon />}
                      sx={rowButtonStyles}
                    >
                      Recibo
                    </Button>
                  )}

                  <Button
                    variant="text"
                    size="small"
                    startIcon={<DetailsIcon />}
                    onClick={() => onSelectTransaction(item)}
                    sx={rowButtonStyles}
                  >
                    Detalhes
                  </Button>
                </Box>
              </Card>
            )
          })}
        </Box>
      )}

      {totalPages > 1 && (
        <Box sx={paginationRowStyles}>
          <Pagination
            count={totalPages}
            page={page}
            disabled={isLoading}
            color="primary"
            shape="rounded"
            onChange={(_e, nextPage) => onPageChange(nextPage)}
          />
        </Box>
      )}
    </Box>
  )
}

export default TransactionsHistory
