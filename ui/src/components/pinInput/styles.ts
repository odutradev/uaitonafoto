import { brandColors } from '@theme'
import type { SxProps, Theme } from '@mui/material'

export const pinContainerStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  width: '100%'
}

export const pinLabelStyles: SxProps<Theme> = {
  fontWeight: 700
}

export const pinSlotsRowStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: { xs: 1.25, sm: 1.75 },
  width: '100%'
}

export const pinSlotInputStyles: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    fontFamily: 'monospace',
    fontWeight: 800,
    fontSize: { xs: '1.5rem', sm: '1.75rem' },
    '&.Mui-focused': {
      '& input::placeholder': {
        animation: 'pinDotPulse 1.1s ease-in-out infinite'
      }
    }
  },
  '& .MuiOutlinedInput-input': {
    textAlign: 'center',
    py: { xs: 1.5, sm: 1.75 },
    px: 0,
    caretColor: 'transparent !important',
    '&::placeholder': {
      color: '#7E7769',
      WebkitTextFillColor: '#7E7769',
      opacity: 0.45,
      transition: 'opacity 0.2s ease, color 0.2s ease'
    }
  },
  '@keyframes pinDotPulse': {
    '0%, 100%': {
      color: '#7E7769',
      WebkitTextFillColor: '#7E7769',
      opacity: 0.55
    },
    '50%': {
      color: brandColors.flashYellow,
      WebkitTextFillColor: brandColors.flashYellow,
      opacity: 1
    }
  }
}

export const pinToggleMaskRowStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  mt: 0.5
}

export const pinToggleMaskButtonStyles: SxProps<Theme> = {
  fontSize: '0.8rem',
  fontWeight: 600,
  textTransform: 'none',
  color: 'text.secondary',
  py: 0.5,
  px: 1,
  borderRadius: '8px',
  '&:hover': {
    color: 'text.primary',
    bgcolor: 'action.hover'
  }
}

