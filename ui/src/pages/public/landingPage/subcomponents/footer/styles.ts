import type { SxProps, Theme } from '@mui/material'

export const footerBoxStyles: SxProps<Theme> = {
  py: { xs: 3, sm: 4 },
  borderTop: 1,
  borderColor: 'divider',
  bgcolor: 'background.default',
  mt: 'auto',
  width: '100%'
}

export const footerContainerStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: { xs: 1.5, sm: 2 },
  px: { xs: 2, sm: 3 },
  textAlign: { xs: 'center', sm: 'left' }
}
