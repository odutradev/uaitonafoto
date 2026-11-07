import type { SxProps, Theme } from '@mui/material'

export const overviewGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    md: 'repeat(3, minmax(0, 1fr))'
  },
  gap: 2
}

export const infoCardStyles: SxProps<Theme> = {
  p: 2.5,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: 1.5,
  minWidth: 0
}

export const cardTopRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1
}

export const metricValueStyles: SxProps<Theme> = {
  fontSize: { xs: '1.5rem', sm: '1.75rem' },
  fontWeight: 800,
  lineHeight: 1.15
}

export const linkButtonStyles: SxProps<Theme> = {
  alignSelf: 'flex-start',
  minHeight: 40,
  px: 2
}
