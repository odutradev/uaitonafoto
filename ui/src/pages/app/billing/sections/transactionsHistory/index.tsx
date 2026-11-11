import { useMemo } from 'react'
import { Box, Button, Card, Chip, FormControl, InputLabel, MenuItem, Paper, Select, Skeleton, Tab, Tabs, Typography } from '@mui/material'
import { OpenInNew as PayNowIcon } from '@mui/icons-material'

import Pagination from '@components/pagination'

import { formatPriceInBrl } from '@utils/functions/formatters'
import { Link as RouterLink } from 'react-router-dom'

import { chipCompactStyles, emptyBoxStyles, filterSelectStyles, filtersRowStyles, getListCardStyles, getTransactionRowStyles, headerFilterBarStyles, historyWrapperStyles, rowActionsStyles, rowButtonStyles, rowMainInfoStyles, rowRightColStyles, rowTitleBadgesStyles } from './styles'
import type { PurchaseItem, TransactionStatus } from '@utils/types/payments'
import type { TransactionStatusFilter, TransactionTypeFilter } from '@pages/app/billing/types'
import type { UnifiedHistoryEntry } from './types'
import useBillingPage from '@pages/app/billing/hook'

const toTimestampMs = (isoDate?: string): number => {
  if (!isoDate) return 0
  const ms = new Date(isoDate).getTime()
  return Number.isNaN(ms) ? 0 : ms
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

const getStatusBadge = (status: TransactionStatus, cancelReason?: string) => {
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
      if (cancelReason === 'cancelled_by_user') {
        return { label: 'Cancelado pelo usuário', color: 'default' as const }
      }
      return { label: 'Cancelado', color: 'default' as const }
    default:
      return { label: 'Cancelado', color: 'default' as const }
  }
}

const getTypeLabel = (planType: string): string => {
  if (planType === 'SUBSCRIPTION') return 'Mensalidade'
  if (planType === 'UPSELL') return 'Complemento'
  if (planType === 'FREE') return 'Teste grátis'
  return 'Avulso'
}

const formatDisplayPlanName = (planName: string, planType: string): string => {
  if (planType === 'FREE' || planName === 'Modo Degustação') return 'Teste Grátis'
  return planName
}

const formatMethodLabel = (method?: string): string | null => {
  if (method === 'PIX') return 'PIX'
  if (method === 'CARD') return 'Cartão'
  if (method === 'BOLETO') return 'Boleto'
  return null
}

const renderAcquiredBadges = (purchase: PurchaseItem) => {
  if (purchase.extraStorageDays > 0 && purchase.credits > 0) {
    return (
      <Chip
        size="small"
        variant="outlined"
        label={`+${purchase.extraStorageDays} dias de galeria`}
        sx={chipCompactStyles}
      />
    )
  }
  return null
}

const itemsPerPage = 6

const TransactionsHistory = () => {
  const { purchases, creditUsages = [], transactions, transactionsPage: page, statusFilter, typeFilter, directionFilter = 'ALL', isLoadingTransactions: isLoading, handleStatusFilterChange: onStatusFilterChange, handleTypeFilterChange: onTypeFilterChange, handleDirectionFilterChange: onDirectionFilterChange, handlePageChange: onPageChange, setSelectedTransaction: onSelectTransaction } = useBillingPage()

  const { allEntries, inCount, outCount } = useMemo(() => {
    const matchingPurchases = purchases.filter((item) => {
      const matchesStatus = statusFilter === 'ALL' || statusFilter === 'PAID'
      const matchesType = typeFilter === 'ALL' || item.planType === typeFilter
      return matchesStatus && matchesType
    })

    const matchingTransactions = transactions.filter((tx) => {
      const matchesStatus = statusFilter === 'ALL' || tx.status === statusFilter
      const matchesType = typeFilter === 'ALL' || tx.planType === typeFilter
      return matchesStatus && matchesType
    })

    const matchingUsages = creditUsages.filter((usage) => {
      const matchesStatus = statusFilter === 'ALL' || statusFilter === 'PAID'
      const matchesType =
        typeFilter === 'ALL' ||
        (typeFilter === 'FREE' ? usage.creditType === 'free' : usage.creditType === 'paid')
      return matchesStatus && matchesType
    })

    const totalIn = matchingPurchases.length + matchingTransactions.length
    const totalOut = matchingUsages.length

    const includeInflows = directionFilter === 'ALL' || directionFilter === 'IN'
    const includeOutflows = directionFilter === 'ALL' || directionFilter === 'OUT'

    const combined: UnifiedHistoryEntry[] = [
      ...(includeInflows
        ? matchingTransactions.map(
            (tx): UnifiedHistoryEntry => ({
              kind: 'transaction',
              id: `tx_${tx.id}`,
              timestamp: tx.paidAt ?? tx.createdAt,
              transaction: tx
            })
          )
        : []),
      ...(includeInflows
        ? matchingPurchases.map(
            (purchase): UnifiedHistoryEntry => ({
              kind: 'purchase',
              id: `purchase_${purchase.id}`,
              timestamp: purchase.createdAt,
              purchase
            })
          )
        : []),
      ...(includeOutflows
        ? matchingUsages.map(
            (usage): UnifiedHistoryEntry => ({
              kind: 'usage',
              id: `usage_${usage.id}`,
              timestamp: usage.createdAt,
              usage
            })
          )
        : [])
    ]

    combined.sort((a, b) => {
      const diff = toTimestampMs(b.timestamp) - toTimestampMs(a.timestamp)
      if (diff !== 0) return diff
      if (a.kind === b.kind) return 0
      return a.kind === 'usage' ? -1 : a.kind === 'purchase' ? 0 : 1
    })

    return { allEntries: combined, inCount: totalIn, outCount: totalOut }
  }, [creditUsages, directionFilter, purchases, statusFilter, transactions, typeFilter])

  const totalRecords = allEntries.length
  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage))
  const safePage = Math.min(Math.max(1, page), totalPages)

  const paginatedEntries = useMemo(() => {
    const startIndex = (safePage - 1) * itemsPerPage
    return allEntries.slice(startIndex, startIndex + itemsPerPage)
  }, [allEntries, safePage])

  return (
    <Box id="transacoes" component="section" sx={historyWrapperStyles}>
      <Box sx={headerFilterBarStyles}>
        <Box>
          <Typography variant="h6" component="h2">
            Transações e créditos
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
              <MenuItem value="PAID">Pagos / Recebidos</MenuItem>
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
              <MenuItem value="FREE">Teste grátis</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Tabs
        value={directionFilter}
        onChange={(_, val) => onDirectionFilterChange(val)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          minHeight: 40,
          '& .MuiTab-root': {
            minHeight: 40,
            py: 0.5,
            px: { xs: 1.5, sm: 2 },
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'none'
          }
        }}
      >
        <Tab label={`Todos (${inCount + outCount})`} value="ALL" />
        <Tab label={`Créditos Adquiridos (+) • ${inCount}`} value="IN" />
        <Tab label={`Créditos Utilizados (-) • ${outCount}`} value="OUT" />
      </Tabs>

      {isLoading && allEntries.length === 0 && (
        <Card elevation={0} sx={getListCardStyles(false)}>
          {[0, 1, 2].map((item, index) => {
            const isLast = index === 2
            return (
              <Box key={item} sx={getTransactionRowStyles(isLast)}>
                <Box sx={rowMainInfoStyles}>
                  <Box sx={rowTitleBadgesStyles}>
                    <Skeleton width={140} height={18} sx={{ borderRadius: '4px' }} />
                    <Skeleton width={54} height={20} sx={{ borderRadius: '9999px' }} />
                  </Box>
                  <Skeleton width={index % 2 === 0 ? 210 : 170} height={14} sx={{ borderRadius: '4px', mt: 0.5 }} />
                </Box>

                <Box sx={rowRightColStyles}>
                  <Skeleton width={60} height={20} sx={{ borderRadius: '4px' }} />
                  <Skeleton width={68} height={32} sx={{ borderRadius: '9999px' }} />
                </Box>
              </Box>
            )
          })}
        </Card>
      )}

      {!isLoading && allEntries.length === 0 && (
        <Paper elevation={0} sx={emptyBoxStyles}>
          <Typography variant="subtitle1" fontWeight={700}>
            {directionFilter === 'OUT'
              ? 'Nenhum uso de crédito encontrado'
              : directionFilter === 'IN'
              ? 'Nenhum crédito adquirido encontrado'
              : 'Nenhum registro encontrado'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {directionFilter === 'OUT'
              ? 'Os créditos utilizados ao criar eventos aparecerão aqui.'
              : directionFilter === 'IN'
              ? 'Seus pagamentos e recebimentos de créditos aparecerão aqui.'
              : 'Seus pagamentos, recebimentos e utilizações de créditos aparecerão aqui.'}
          </Typography>
        </Paper>
      )}

      {paginatedEntries.length > 0 && (
        <Card elevation={0} sx={getListCardStyles(isLoading)}>
          {paginatedEntries.map((entry, index) => {
            const isLast = index === paginatedEntries.length - 1
            const referenceDate = formatDatePtBr(entry.timestamp)

            if (entry.kind === 'purchase') {
              const { purchase } = entry
              const displayName = formatDisplayPlanName(purchase.planName, purchase.planType)
              const rowTitle =
                purchase.credits > 0
                  ? `Recebimento de créditos • ${displayName}`
                  : `Complemento liberado • ${displayName}`
              const creditSummaryLabel =
                purchase.credits > 0
                  ? `+${purchase.credits} ${purchase.credits === 1 ? 'crédito' : 'créditos'}`
                  : `+${purchase.extraStorageDays} dias`

              return (
                <Box key={entry.id} sx={getTransactionRowStyles(isLast)}>
                  <Box sx={rowMainInfoStyles}>
                    <Box sx={rowTitleBadgesStyles}>
                      <Typography variant="body2" fontWeight={700}>
                        {rowTitle}
                      </Typography>
                      {renderAcquiredBadges(purchase)}
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      {referenceDate} • {getTypeLabel(purchase.planType)}
                    </Typography>
                  </Box>

                  <Box sx={rowRightColStyles}>
                    <Typography variant="body2" fontWeight={800} color="success.main">
                      {creditSummaryLabel}
                    </Typography>
                  </Box>
                </Box>
              )
            }

            if (entry.kind === 'usage') {
              const { usage } = entry
              const rowTitle = `Uso de crédito • ${usage.eventName}`
              const creditSummaryLabel = `-${usage.amount} ${usage.amount === 1 ? 'crédito' : 'créditos'}`

              return (
                <Box key={entry.id} sx={getTransactionRowStyles(isLast)}>
                  <Box sx={rowMainInfoStyles}>
                    <Box sx={rowTitleBadgesStyles}>
                      <Typography variant="body2" fontWeight={700}>
                        {rowTitle}
                      </Typography>
                      <Chip
                        size="small"
                        color="default"
                        label="Utilizado"
                        sx={chipCompactStyles}
                      />
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      {referenceDate} • Criação de evento • {usage.creditType === 'free' ? 'Teste grátis' : 'Crédito avulso / mensal'}
                    </Typography>
                  </Box>

                  <Box sx={rowRightColStyles}>
                    <Typography variant="body2" fontWeight={800} color="text.secondary">
                      {creditSummaryLabel}
                    </Typography>

                    <Box sx={rowActionsStyles}>
                      <Button
                        component={RouterLink}
                        to={`/app/events/${usage.eventId}`}
                        variant="outlined"
                        size="small"
                        sx={rowButtonStyles}
                      >
                        Ver evento
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )
            }

            const { transaction: item } = entry
            const statusBadge = getStatusBadge(item.status, item.cancelReason)
            const amountFormatted = formatPriceInBrl(item.paidAmount ?? item.amount)
            const methodLabel = formatMethodLabel(item.paymentMethod)

            return (
              <Box key={entry.id} sx={getTransactionRowStyles(isLast)}>
                <Box sx={rowMainInfoStyles}>
                  <Box sx={rowTitleBadgesStyles}>
                    <Typography variant="body2" fontWeight={700}>
                      {formatDisplayPlanName(item.planName, item.planType)}
                    </Typography>
                    <Chip
                      size="small"
                      color={statusBadge.color}
                      label={statusBadge.label}
                      sx={chipCompactStyles}
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

      {allEntries.length > 0 && (
        <Pagination
          page={safePage}
          totalPages={totalPages}
          totalItems={totalRecords}
          isLoading={isLoading}
          onPageChange={onPageChange}
          hideOnSinglePage={false}
        />
      )}
    </Box>
  )
}

export default TransactionsHistory
