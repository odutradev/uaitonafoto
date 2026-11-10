import type { SxProps, Theme } from '@mui/material'

export const adminPageStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: { xs: 3, sm: 4 },
  width: '100%',
  pb: 6
}

export const headerRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'flex-start', sm: 'center' },
  justifyContent: 'space-between',
  gap: 2
}

export const pageTitleStyles: SxProps<Theme> = {
  fontSize: { xs: '1.75rem', sm: '2.25rem' },
  fontWeight: 800,
  display: 'flex',
  alignItems: 'center',
  gap: 1.5
}

export const kpiGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, minmax(0, 1fr))',
    md: 'repeat(4, minmax(0, 1fr))'
  },
  gap: 2
}

export const kpiCardStyles: SxProps<Theme> = {
  p: 2.5,
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  position: 'relative',
  overflow: 'hidden',
  boxShadow: (theme) =>
    theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.04)'
}

export const chartsGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    lg: '2fr 1fr'
  },
  gap: 2.5
}

export const chartCardStyles: SxProps<Theme> = {
  p: 3,
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  minHeight: 380,
  boxShadow: (theme) =>
    theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.04)'
}

export const tableCardStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 3 },
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5,
  boxShadow: (theme) =>
    theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.04)'
}

export const filterRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  gap: 2,
  alignItems: { xs: 'stretch', sm: 'center' },
  justifyContent: 'space-between'
}

export const tableContainerStyles: SxProps<Theme> = {
  borderRadius: '12px',
  overflowX: 'auto',
  border: 1,
  borderColor: 'divider'
}

