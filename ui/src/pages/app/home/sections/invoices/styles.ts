import type { SxProps, Theme } from '@mui/material'

export const sectionTitleStyles: SxProps<Theme> = {
  fontSize: { xs: '1.125rem', sm: '1.25rem' },
  mb: 2
}

export const getListStackStyles = (isLoading: boolean): SxProps<Theme> => ({
  gap: 1.5,
  opacity: isLoading ? 0.6 : 1,
  transition: 'opacity 0.2s ease'
})

export const invoiceCardStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'stretch', sm: 'center' },
  justifyContent: 'space-between',
  gap: 2,
  p: { xs: 2, sm: 2.5 },
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: '16px'
}

export const invoiceInfoBoxStyles: SxProps<Theme> = {
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 0.5
}

export const titleRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 1
}

export const planNameStyles: SxProps<Theme> = {
  fontSize: { xs: '0.95rem', sm: '1.05rem' },
  fontWeight: 700,
  overflowWrap: 'anywhere'
}

export const badgeChipStyles: SxProps<Theme> = {
  fontWeight: 700
}

export const receiptButtonStyles: SxProps<Theme> = {
  width: { xs: '100%', sm: 'auto' },
  minHeight: 48,
  fontWeight: 700,
  flexShrink: 0
}

export const paidChipStyles: SxProps<Theme> = {
  alignSelf: { xs: 'flex-start', sm: 'center' },
  fontWeight: 700
}

export const paginationBoxStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  mt: 2.5
}
