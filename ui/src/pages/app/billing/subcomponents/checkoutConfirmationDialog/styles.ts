import type { SxProps, Theme } from '@mui/material'

export const confirmationDialogPaperStyles: SxProps<Theme> = {
  borderRadius: '20px',
  maxWidth: 540,
  width: 'calc(100% - 32px)',
  m: 2,
  overflow: 'hidden'
}

export const dialogContentBoxStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5,
  pt: 1
}

export const planSummaryCardStyles: SxProps<Theme> = {
  p: 2.5,
  borderRadius: '16px',
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
  boxShadow: (theme) =>
    theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.05)'
}

export const priceRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'baseline',
  gap: 1,
  mt: 1.5,
  mb: 0.5
}

export const priceValueStyles: SxProps<Theme> = {
  fontSize: { xs: '1.75rem', sm: '2rem' },
  fontWeight: 800,
  color: 'text.primary',
  letterSpacing: '-0.02em',
  lineHeight: 1
}

export const featuresContainerStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  mt: 2,
  pt: 2,
  borderTop: '1px dashed',
  borderColor: 'divider'
}

export const featureRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.25
}

export const checkIconStyles: SxProps<Theme> = {
  fontSize: 18,
  color: 'success.main',
  flexShrink: 0
}

export const noticeBoxStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 1.5,
  p: 2,
  borderRadius: '12px',
  bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.08)' : 'rgba(33, 150, 243, 0.06)'),
  border: '1px solid',
  borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.15)')
}

export const dialogActionsStyles: SxProps<Theme> = {
  px: 3,
  pb: 3,
  pt: 1,
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '140px 1fr' },
  gap: 1.5,
  width: '100%',
  boxSizing: 'border-box'
}

export const cancelButtonStyles: SxProps<Theme> = {
  minHeight: 48,
  borderRadius: '12px',
  fontWeight: 700,
  textTransform: 'none',
  order: { xs: 2, sm: 1 },
  width: '100%'
}

export const confirmButtonStyles: SxProps<Theme> = {
  minHeight: 48,
  borderRadius: '12px',
  fontWeight: 700,
  textTransform: 'none',
  order: { xs: 1, sm: 2 },
  width: '100%',
  whiteSpace: 'nowrap'
}
