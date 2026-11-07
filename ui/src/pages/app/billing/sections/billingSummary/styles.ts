import type { SxProps, Theme } from '@mui/material'

export const kpiGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, minmax(0, 1fr))'
  },
  gap: 2
}

export const kpiCardStyles: SxProps<Theme> = {
  p: 2.25,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: 0.75,
  minWidth: 0
}

export const kpiValueStyles: SxProps<Theme> = {
  fontSize: { xs: '1.6rem', sm: '1.85rem' },
  fontWeight: 800,
  lineHeight: 1.1
}

export const trialRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 1
}

export const claimButtonStyles: SxProps<Theme> = {
  minHeight: 34,
  px: 1.5,
  py: 0.5,
  fontSize: '0.8125rem'
}
