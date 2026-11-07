import type { SxProps, Theme } from '@mui/material'
import type { ModalVariant } from './types'

export const modalBackdropStyles: SxProps<Theme> = {
  backdropFilter: 'blur(6px)',
  backgroundColor: 'rgba(0, 0, 0, 0.7)'
}

export const modalPaperStyles: SxProps<Theme> = {
  borderRadius: '24px',
  p: { xs: 2.5, sm: 3 },
  maxWidth: 440,
  width: 'calc(100% - 32px)',
  m: 2,
  position: 'relative',
  overflow: 'visible'
}

export const closeButtonStyles: SxProps<Theme> = {
  position: 'absolute',
  top: 14,
  right: 14,
  color: 'text.secondary',
  '&:hover': {
    color: 'text.primary',
    backgroundColor: 'action.hover'
  }
}

export const getIconWrapperStyles = (variant: ModalVariant = 'default'): SxProps<Theme> => {
  const getColors = () => {
    switch (variant) {
      case 'danger':
        return {
          bg: 'rgba(239, 68, 68, 0.12)',
          color: 'error.main'
        }
      case 'warning':
        return {
          bg: 'rgba(245, 158, 11, 0.12)',
          color: 'warning.main'
        }
      case 'info':
        return {
          bg: 'rgba(59, 130, 246, 0.12)',
          color: 'info.main'
        }
      case 'default':
      default:
        return {
          bg: 'action.hover',
          color: 'text.primary'
        }
    }
  }

  const { bg, color } = getColors()

  return {
    width: 48,
    height: 48,
    borderRadius: '14px',
    backgroundColor: bg,
    color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    mb: 2,
    '& svg': {
      fontSize: 26
    }
  }
}

export const modalTitleStyles: SxProps<Theme> = {
  fontWeight: 800,
  fontSize: { xs: '1.25rem', sm: '1.35rem' },
  lineHeight: 1.25,
  mb: 1
}

export const modalDescriptionStyles: SxProps<Theme> = {
  color: 'text.secondary',
  fontSize: '0.9375rem',
  lineHeight: 1.6
}

export const modalActionsStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column-reverse', sm: 'row' },
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 1.25,
  mt: 3
}

export const modalActionButtonStyles: SxProps<Theme> = {
  minHeight: 44,
  px: 2.5,
  fontSize: '0.9375rem',
  fontWeight: 700,
  width: { xs: '100%', sm: 'auto' },
  whiteSpace: 'nowrap'
}

