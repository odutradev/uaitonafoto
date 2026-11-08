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

export const getUserBadgeStyles = (isDark: boolean): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  gap: { xs: 0, sm: 1 },
  textDecoration: 'none',
  color: 'inherit',
  px: { xs: 0.5, sm: 1.25 },
  py: 0.5,
  height: { xs: 38, sm: 42 },
  borderRadius: '999px',
  border: 1,
  borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)',
  bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    borderColor: 'primary.main',
    bgcolor: isDark ? 'rgba(255, 207, 31, 0.08)' : 'rgba(255, 207, 31, 0.12)'
  }
})

export const userAvatarStyles: SxProps<Theme> = {
  width: { xs: 28, sm: 30 },
  height: { xs: 28, sm: 30 },
  fontSize: '0.8125rem',
  fontWeight: 800,
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  flexShrink: 0
}

export const userTextContainerStyles: SxProps<Theme> = {
  display: { xs: 'none', sm: 'flex' },
  flexDirection: 'column',
  justifyContent: 'center',
  maxWidth: { sm: 120, md: 160 },
  pr: 0.5
}

export const userGreetingStyles: SxProps<Theme> = {
  fontSize: '0.6875rem',
  fontWeight: 600,
  color: 'text.secondary',
  lineHeight: 1
}

export const userNameStyles: SxProps<Theme> = {
  fontSize: '0.8125rem',
  fontWeight: 700,
  color: 'text.primary',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  lineHeight: 1.2
}
