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

export const headerRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'stretch', sm: 'flex-start' },
  justifyContent: 'space-between',
  gap: 2
}

export const headerTitleBlockStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.75,
  minWidth: 0
}

export const titleAndChipsRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 1.25
}

export const titleStyles: SxProps<Theme> = {
  fontWeight: 800,
  fontSize: { xs: '1.5rem', sm: '1.85rem' },
  overflowWrap: 'anywhere'
}

export const chipsStyles: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 0.75
}

export const headerActionButtonStyles: SxProps<Theme> = {
  minHeight: 42,
  px: 2.25,
  fontSize: '0.875rem',
  width: { xs: '100%', sm: 'auto' },
  flexShrink: 0
}

export const tabsContainerStyles: SxProps<Theme> = {
  borderBottom: 1,
  borderColor: 'divider'
}

export const tabsStyles: SxProps<Theme> = {
  minHeight: 44,
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: '3px 3px 0 0'
  }
}

export const tabItemStyles: SxProps<Theme> = {
  minHeight: 44,
  py: 1,
  px: 2,
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '0.9rem'
}
