import type { SxProps, Theme } from '@mui/material'

export const joinPaperStyles: SxProps<Theme> = {
  p: { xs: 2.5, sm: 3.5 },
  display: 'flex',
  flexDirection: 'column',
  gap: 2
}

export const joinButtonStyles: SxProps<Theme> = {
  minHeight: 48,
  width: '100%'
}

export const pinSectionStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1
}

export const pinSlotsRowStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: { xs: 1.25, sm: 1.75 }
}

export const pinSlotInputStyles: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    fontFamily: 'monospace',
    fontWeight: 800,
    fontSize: { xs: '1.5rem', sm: '1.75rem' }
  },
  '& .MuiOutlinedInput-input': {
    textAlign: 'center',
    py: { xs: 1.5, sm: 1.75 },
    px: 0
  }
}

