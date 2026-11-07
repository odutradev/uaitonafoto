import type { SxProps, Theme } from '@mui/material'

export const sectionsStackStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3
}

export const formCardStyles: SxProps<Theme> = {
  p: { xs: 2.5, sm: 3.5 },
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5
}

export const fieldsGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
  gap: 2.5
}

export const actionsRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column-reverse', sm: 'row' },
  justifyContent: 'flex-end',
  gap: 1.5,
  pt: 1
}

export const actionButtonStyles: SxProps<Theme> = {
  minHeight: 48,
  width: { xs: '100%', sm: 'auto' }
}

export const securityRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'stretch', sm: 'center' },
  justifyContent: 'space-between',
  gap: 2
}
