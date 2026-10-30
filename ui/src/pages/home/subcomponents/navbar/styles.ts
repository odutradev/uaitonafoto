import type { SxProps, Theme } from '@mui/material'

export const getHeaderStyles = (isDark: boolean): SxProps<Theme> => ({
  py: { xs: 1.25, sm: 2 },
  borderBottom: 1,
  borderColor: 'divider',
  bgcolor: isDark ? 'rgba(18, 16, 12, 0.85)' : 'rgba(251, 248, 241, 0.85)',
  position: 'sticky',
  top: 0,
  zIndex: 10,
  backdropFilter: 'blur(10px)',
  width: '100%'
})

export const navContainerStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  px: { xs: 2, sm: 3 }
}

export const loginButtonStyles: SxProps<Theme> = {
  px: { xs: 1.75, sm: 2.5 },
  height: { xs: 38, sm: 42 },
  fontWeight: 800,
  fontSize: { xs: '0.8125rem', sm: '0.9375rem' },
  whiteSpace: 'nowrap',
  flexShrink: 0,
  '& .MuiButton-endIcon': {
    ml: { xs: 0.5, sm: 1 },
    '& svg': {
      fontSize: { xs: 16, sm: 20 }
    }
  }
}
