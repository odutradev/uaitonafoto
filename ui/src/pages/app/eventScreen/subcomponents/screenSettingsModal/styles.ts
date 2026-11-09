import { brandColors } from '@theme'
import type { SxProps, Theme } from '@mui/material'

export const settingsSectionStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.25,
  width: '100%'
}

export const settingsSectionTitleStyles: SxProps<Theme> = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.8rem',
  fontWeight: 800,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'text.secondary'
}

export const getLayoutCardStyles = (isSelected: boolean): SxProps<Theme> => (theme) => ({
  p: 2,
  borderRadius: '16px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: isSelected
    ? `2px solid ${brandColors.flashYellow}`
    : `1px solid ${theme.palette.divider}`,
  bgcolor: isSelected
    ? theme.palette.mode === 'dark'
      ? 'rgba(255, 207, 31, 0.08)'
      : 'rgba(255, 207, 31, 0.12)'
    : theme.palette.mode === 'dark'
      ? brandColors.darkSurface
      : brandColors.sand,
  boxShadow: isSelected ? '0 0 16px rgba(255, 207, 31, 0.25)' : 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2,
  '&:hover': {
    borderColor: brandColors.flashYellow
  }
})

export const settingRowStyles: SxProps<Theme> = (theme) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  p: 2,
  borderRadius: '16px',
  bgcolor: theme.palette.mode === 'dark' ? brandColors.darkSurface : brandColors.sand,
  border: `1px solid ${theme.palette.divider}`,
  gap: 2
})
