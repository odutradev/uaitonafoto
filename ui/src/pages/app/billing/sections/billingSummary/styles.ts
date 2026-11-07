import type { SxProps, Theme } from '@mui/material'

export const summaryWrapperStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5
}

export const kpiGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, minmax(0, 1fr))',
    lg: 'repeat(3, minmax(0, 1fr))'
  },
  gap: 2
}

export const kpiCardStyles: SxProps<Theme> = {
  p: 2.5,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: 1.5,
  minWidth: 0
}

export const kpiHeaderRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1
}

export const kpiValueStyles: SxProps<Theme> = {
  fontSize: { xs: '1.75rem', sm: '2rem' },
  fontWeight: 800,
  lineHeight: 1.1
}

export const claimButtonStyles: SxProps<Theme> = {
  minHeight: 44,
  alignSelf: 'flex-start',
  width: { xs: '100%', sm: 'auto' }
}

export const batchesCardStyles: SxProps<Theme> = {
  p: 2.5,
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5
}

export const batchItemRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'flex-start', sm: 'center' },
  justifyContent: 'space-between',
  gap: 1,
  p: 1.5,
  borderRadius: '12px',
  bgcolor: 'action.hover'
}
