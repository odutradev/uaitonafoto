import type { SxProps, Theme } from '@mui/material'

export const getHeaderStyles = (isDark: boolean): SxProps<Theme> => ({
  py: 2,
  borderBottom: 1,
  borderColor: 'divider',
  bgcolor: isDark ? 'rgba(18, 16, 12, 0.85)' : 'rgba(251, 248, 241, 0.85)',
  position: 'sticky',
  top: 0,
  zIndex: 10,
  backdropFilter: 'blur(10px)'
})

export const navContainerStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}

export const loginButtonStyles: SxProps<Theme> = {
  px: 2.5,
  fontWeight: 800,
  fontSize: '0.9375rem'
}
