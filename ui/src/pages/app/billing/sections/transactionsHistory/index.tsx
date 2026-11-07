import { useMemo } from 'react'
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
  chipCompactStyles,
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
import type { PurchaseItem, TransactionStatus } from '@actions/payments/types'
import type { TransactionStatusFilter, TransactionTypeFilter } from '../../types'
import type { TransactionsHistoryProps, UnifiedHistoryEntry } from './types'

const toTimestampMs = (isoDate?: string): number => {
  if (!isoDate) return 0
  const ms = new Date(isoDate).getTime()
  return Number.isNaN(ms) ? 0 : ms
}

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
  if (planType === 'FREE') return 'Degustação'
  return 'Avulso'
}

const formatMethodLabel = (method?: string): string | null => {
  if (method === 'PIX') return 'PIX'
  if (method === 'CARD') return 'Cartão'
  if (method === 'BOLETO') return 'Boleto'
  return null
}

const renderAcquiredBadges = (purchase?: PurchaseItem) => {
  if (!purchase) return null

  return (
    <>
      {purchase.credits > 0 && (
        <Chip
          size="small"
          color={purchase.remainingCredits > 0 ? 'primary' : 'default'}
          variant={purchase.remainingCredits > 0 ? 'filled' : 'outlined'}
          label={`${purchase.remainingCredits}/${purchase.credits} disp.`}
          sx={chipCompactStyles}
        />
      )}
      {purchase.extraStorageDays > 0 && (
        <Chip
          size="small"
          variant="outlined"
          label={`+${purchase.extraStorageDays} dias de galeria`}
          sx={chipCompactStyles}
        />
      )}
    </>
  )
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
  const { entries, totalRecords } = useMemo(() => {
    const purchaseByTxId = new Map<string, PurchaseItem>(
      purchases.map((item) => [item.transactionId, item])
    )
    const txIdsOnPage = new Set(transactions.map((tx) => tx.id))

    const matchingStandalonePurchases = purchases.filter((item) => {
      if (txIdsOnPage.has(item.transactionId)) return false

      const isStandaloneAcquisition =
        item.creditType === 'free' ||
        item.planType === 'FREE' ||
        (totalPages <= 1 && statusFilter === 'ALL' && typeFilter === 'ALL')

      if (!isStandaloneAcquisition) return false

      const matchesStatus = statusFilter === 'ALL' || statusFilter === 'PAID'
      const matchesType = typeFilter === 'ALL' || item.planType === typeFilter
      return matchesStatus && matchesType
    })

    const txTimestamps = transactions.map((tx) => toTimestampMs(tx.paidAt ?? tx.createdAt))
    const newestOnPage = txTimestamps.length > 0 ? Math.max(...txTimestamps) : 0
    const oldestOnPage = txTimestamps.length > 0 ? Math.min(...txTimestamps) : 0

    const pageStandalonePurchases = matchingStandalonePurchases.filter((item) => {
      if (totalPages <= 1 || transactions.length === 0) return true
      const itemMs = toTimestampMs(item.createdAt)
      if (page === 1) return itemMs >= oldestOnPage
      if (page === totalPages) return itemMs < oldestOnPage
      return itemMs < newestOnPage && itemMs >= oldestOnPage
    })

    const combined: UnifiedHistoryEntry[] = [
      ...transactions.map(
        (tx): UnifiedHistoryEntry => ({
          kind: 'transaction',
          id: tx.id,
          timestamp: tx.paidAt ?? tx.createdAt,
          transaction: tx,
          purchase: purchaseByTxId.get(tx.id)
        })
      ),
      ...pageStandalonePurchases.map(
        (purchase): UnifiedHistoryEntry => ({
          kind: 'purchase',
          id: `purchase_${purchase.id}`,
          timestamp: purchase.createdAt,
          purchase
        })
      )
    ]

    combined.sort((a, b) => toTimestampMs(b.timestamp) - toTimestampMs(a.timestamp))

    return {
      entries: combined,
      totalRecords: total + matchingStandalonePurchases.length
    }
  }, [page, purchases, statusFilter, total, totalPages, transactions, typeFilter])

  return (
    <Box id="transacoes" component="section" sx={historyWrapperStyles}>
      <Box sx={headerFilterBarStyles}>
        <Box>
          <Typography variant="h6" component="h2">
            Transações e itens adquiridos
          </Typography>
          {totalRecords > 0 && (
            <Typography variant="caption" color="text.secondary">
              {totalRecords} {totalRecords === 1 ? 'registro' : 'registros'}
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
              <MenuItem value="PAID">Pagos / Ativos</MenuItem>
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
              <MenuItem value="FREE">Degustação</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {isLoading && entries.length === 0 && (
        <Stack spacing={1}>
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} variant="rounded" height={68} sx={{ borderRadius: '16px' }} />
          ))}
        </Stack>
      )}

      {!isLoading && entries.length === 0 && (
        <Paper elevation={0} sx={emptyBoxStyles}>
          <Typography variant="subtitle1" fontWeight={700}>
            Nenhum registro encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Suas transações e créditos adquiridos aparecerão aqui.
          </Typography>
        </Paper>
      )}

      {entries.length > 0 && (
        <Card elevation={0} sx={getListCardStyles(isLoading)}>
          {entries.map((entry, index) => {
            const isLast = index === entries.length - 1
            const referenceDate = formatDatePtBr(entry.timestamp)

            if (entry.kind === 'purchase') {
              const { purchase } = entry
              const expiresFormatted =
                purchase.remainingCredits > 0 ? formatShortDatePtBr(purchase.creditsExpiresAt) : null
              const amountLabel = purchase.amount === 0 ? 'Grátis' : formatPriceInBrl(purchase.amount)

              return (
                <Box key={entry.id} sx={getTransactionRowStyles(isLast)}>
                  <Box sx={rowMainInfoStyles}>
                    <Box sx={rowTitleBadgesStyles}>
                      <Typography variant="body2" fontWeight={700}>
                        {purchase.planName}
                      </Typography>
                      <Chip
                        size="small"
                        color="success"
                        label="Resgatado"
                        sx={chipCompactStyles}
                      />
                      {renderAcquiredBadges(purchase)}
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      {referenceDate} • {getTypeLabel(purchase.planType)}
                      {expiresFormatted ? ` • Válido até ${expiresFormatted}` : ''}
                    </Typography>
                  </Box>

                  <Box sx={rowRightColStyles}>
                    <Typography variant="body2" fontWeight={800}>
                      {amountLabel}
                    </Typography>
                  </Box>
                </Box>
              )
            }

            const { transaction: item, purchase } = entry
            const statusBadge = getStatusBadge(item.status)
            const amountFormatted = formatPriceInBrl(item.paidAmount ?? item.amount)
            const methodLabel = formatMethodLabel(item.paymentMethod)
            const expiresFormatted =
              purchase && purchase.remainingCredits > 0
                ? formatShortDatePtBr(purchase.creditsExpiresAt)
                : null

            return (
              <Box key={entry.id} sx={getTransactionRowStyles(isLast)}>
                <Box sx={rowMainInfoStyles}>
                  <Box sx={rowTitleBadgesStyles}>
                    <Typography variant="body2" fontWeight={700}>
                      {item.planName}
                    </Typography>
                    <Chip
                      size="small"
                      color={statusBadge.color}
                      label={statusBadge.label}
                      sx={chipCompactStyles}
                    />
                    {renderAcquiredBadges(purchase)}
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    {referenceDate} • {getTypeLabel(item.planType)}
                    {methodLabel ? ` • ${methodLabel}` : ''}
                    {expiresFormatted ? ` • Válido até ${expiresFormatted}` : ''}
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
