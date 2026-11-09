import type { SxProps, Theme } from '@mui/material'

export const pageStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  width: '100%',
  minWidth: 0
}

export const backButtonStyles: SxProps<Theme> = {
  alignSelf: 'flex-start',
  minHeight: 32,
  px: 1,
  py: 0.25,
  borderRadius: '8px',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'text.secondary'
}

export const tabsContainerStyles: SxProps<Theme> = {
  width: '100%',
  borderBottom: 1,
  borderColor: 'divider'
}

export const tabsStyles: SxProps<Theme> = {
  width: '100%',
  minHeight: 40,
  '& .MuiTabs-flexContainer': {
    width: '100%'
  },
  '& .MuiTabs-indicator': {
    height: 2,
    borderRadius: '2px 2px 0 0'
  }
}

export const tabItemStyles: SxProps<Theme> = {
  flex: 1,
  maxWidth: 'none',
  minHeight: 40,
  py: 0.75,
  px: 1.5,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.84rem'
}

