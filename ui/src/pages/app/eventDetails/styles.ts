import type { SxProps, Theme } from '@mui/material'

export const pageStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: { xs: 2.5, sm: 3 },
  width: '100%',
  minWidth: 0
}

export const backButtonStyles: SxProps<Theme> = {
  alignSelf: 'flex-start',
  minHeight: 36,
  px: 1.5,
  py: 0.5,
  fontSize: '0.875rem',
  color: 'text.secondary'
}

export const tabsContainerStyles: SxProps<Theme> = {
  width: '100%',
  borderBottom: 1,
  borderColor: 'divider'
}

export const tabsStyles: SxProps<Theme> = {
  width: '100%',
  minHeight: 44,
  '& .MuiTabs-flexContainer': {
    width: '100%'
  },
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: '3px 3px 0 0'
  }
}

export const tabItemStyles: SxProps<Theme> = {
  flex: 1,
  maxWidth: 'none',
  minHeight: 44,
  py: 1,
  px: 2,
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '0.9rem'
}
