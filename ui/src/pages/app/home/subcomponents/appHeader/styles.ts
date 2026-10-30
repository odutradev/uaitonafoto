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

export const headerContainerStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  px: { xs: 2, sm: 3 }
}

export const avatarButtonStyles: SxProps<Theme> = {
  p: 0.25,
  width: 44,
  height: 44
}

export const avatarStyles: SxProps<Theme> = {
  width: 38,
  height: 38,
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  fontWeight: 800
}

export const menuPaperStyles: SxProps<Theme> = {
  mt: 1,
  minWidth: 220,
  maxWidth: 'calc(100vw - 32px)'
}

export const menuUserInfoStyles: SxProps<Theme> = {
  px: 2,
  py: 1.5
}

export const menuTextEllipsisStyles: SxProps<Theme> = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}

export const logoutItemStyles: SxProps<Theme> = {
  minHeight: 48
}

