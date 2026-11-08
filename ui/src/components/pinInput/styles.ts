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
    fontSize: { xs: '1.5rem', sm: '1.75rem' }
  },
  '& .MuiOutlinedInput-input': {
    textAlign: 'center',
    py: { xs: 1.5, sm: 1.75 },
    px: 0
  }
}

