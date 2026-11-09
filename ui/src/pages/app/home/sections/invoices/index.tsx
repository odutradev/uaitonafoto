import { Box, Button, Card, Chip, Pagination, Stack, Typography } from '@mui/material'
import { ReceiptLong as ReceiptLongIcon } from '@mui/icons-material'

import { formatPriceInBrl } from '@config/formatters'

import {
  badgeChipStyles,
  getListStackStyles,
  invoiceCardStyles,
  invoiceInfoBoxStyles,
  paidChipStyles,
  paginationBoxStyles,
  planNameStyles,
  receiptButtonStyles,
  sectionTitleStyles,
  titleRowStyles
} from './styles'
import type { InvoicesProps } from './types'

const formatDatePtBr = (isoDate?: string): string => {
  if (!isoDate) return '-'
  const parsed = new Date(isoDate)
  if (Number.isNaN(parsed.getTime())) return '-'
  return parsed.toLocaleDateString('pt-BR')
}

const formatMethodLabel = (method?: string): string | null => {
  if (method === 'PIX') return 'PIX'
  if (method === 'CARD') return 'Cartão'
  if (method === 'BOLETO') return 'Boleto'
  return null
}

const Invoices = ({ invoices, page, totalPages, isLoading, onPageChange }: InvoicesProps) => {
  if (invoices.length === 0 && page === 1) return null

  return (
    <Box id="faturas" component="section">
      <Typography variant="h5" component="h2" sx={sectionTitleStyles}>
        Histórico de faturas
      </Typography>

      <Stack sx={getListStackStyles(isLoading)}>
        {invoices.map((invoice) => {
          const isRecurring = invoice.planType === 'SUBSCRIPTION'
          const paidDate = formatDatePtBr(invoice.paidAt ?? invoice.createdAt)
          const amountFormatted = formatPriceInBrl(invoice.paidAmount ?? invoice.amount)
          const methodLabel = formatMethodLabel(invoice.paymentMethod)

          return (
            <Card key={invoice.id} elevation={0} sx={invoiceCardStyles}>
              <Box sx={invoiceInfoBoxStyles}>
                <Box sx={titleRowStyles}>
                  <Typography variant="subtitle1" component="h3" sx={planNameStyles}>
                    {invoice.planName}
                  </Typography>
                  <Chip
                    size="small"
                    variant="outlined"
                    color={isRecurring ? 'primary' : 'default'}
                    label={isRecurring ? 'Mensalidade' : 'Avulso'}
                    sx={badgeChipStyles}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary">
                  {amountFormatted} • Pago em {paidDate}
                  {methodLabel ? ` • ${methodLabel}` : ''}
                </Typography>
              </Box>

              {invoice.receiptUrl ? (
                <Button
                  component="a"
                  href={invoice.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  startIcon={<ReceiptLongIcon />}
                  sx={receiptButtonStyles}
                >
                  Ver recibo
                </Button>
              ) : (
                <Chip
                  size="small"
                  color="success"
                  variant="outlined"
                  label="Pago"
                  sx={paidChipStyles}
                />
              )}
            </Card>
          )
        })}
      </Stack>

      {totalPages > 1 && (
        <Box sx={paginationBoxStyles}>
          <Pagination
            count={totalPages}
            page={page}
            disabled={isLoading}
            color="primary"
            shape="rounded"
            onChange={(_event, nextPage) => onPageChange(nextPage)}
          />
        </Box>
      )}
    </Box>
  )
}

export default Invoices
