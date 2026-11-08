import type { SxProps, Theme } from '@mui/material'

export const stepperContainerStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  position: 'relative',
  py: 1
}

export const stepItemStyles = (isClickable: boolean): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1.25,
  cursor: isClickable ? 'pointer' : 'default',
  userSelect: 'none',
  transition: 'opacity 0.2s ease',
  '&:hover': {
    opacity: isClickable ? 0.8 : 1
  }
})

export const stepBadgeStyles = (status: 'completed' | 'active' | 'upcoming'): SxProps<Theme> => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.875rem',
  fontWeight: 700,
  flexShrink: 0,
  transition: 'all 0.25s ease',
  ...(status === 'completed' && {
    bgcolor: 'primary.main',
    color: 'primary.contrastText'
  }),
  ...(status === 'active' && {
    bgcolor: 'action.hover',
    color: 'primary.main',
    border: 2,
    borderColor: 'primary.main'
  }),
  ...(status === 'upcoming' && {
    bgcolor: 'transparent',
    color: 'text.secondary',
    border: 1,
    borderColor: 'divider'
  })
})

export const stepLabelWrapperStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0
}

export const stepLabelStyles = (status: 'completed' | 'active' | 'upcoming'): SxProps<Theme> => ({
  fontSize: { xs: '0.75rem', sm: '0.875rem' },
  fontWeight: status === 'active' ? 700 : 500,
  color: status === 'upcoming' ? 'text.secondary' : 'text.primary',
  whiteSpace: 'nowrap',
  transition: 'color 0.2s ease'
})

export const stepDescriptionStyles: SxProps<Theme> = {
  fontSize: '0.7rem',
  color: 'text.secondary',
  display: { xs: 'none', md: 'block' },
  whiteSpace: 'nowrap'
}

export const stepConnectorStyles = (isCompleted: boolean): SxProps<Theme> => ({
  flex: 1,
  height: 2,
  mx: { xs: 1, sm: 2 },
  borderRadius: 1,
  bgcolor: isCompleted ? 'primary.main' : 'divider',
  transition: 'background-color 0.3s ease'
})
