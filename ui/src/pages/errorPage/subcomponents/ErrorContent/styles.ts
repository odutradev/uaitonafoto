import type { SxProps, Theme } from '@mui/material'

export const errorWrapperStyles: SxProps<Theme> = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  py: 6
}

export const errorTitleStyles: SxProps<Theme> = {
  fontWeight: 800
}
