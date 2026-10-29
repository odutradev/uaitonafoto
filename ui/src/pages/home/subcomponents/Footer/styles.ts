import type { SxProps, Theme } from '@mui/material'

export const footerBoxStyles: SxProps<Theme> = {
  py: 4,
  borderTop: 1,
  borderColor: 'divider',
  bgcolor: 'background.default',
  mt: 'auto'
}

export const footerContainerStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2
}

