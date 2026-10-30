import type { SxProps, Theme } from '@mui/material'

export const demoContainerStyles: SxProps<Theme> = {
  py: { xs: 6, sm: 8, md: 12 },
  px: { xs: 2, sm: 3 }
}

export const demoGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '1.35fr 1fr' },
  gap: { xs: 3, md: 4 },
  alignItems: 'stretch',
  width: '100%'
}
