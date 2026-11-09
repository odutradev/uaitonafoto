import { brandColors } from '@theme'
import type { SxProps, Theme } from '@mui/material'

export const modalDialogPaperStyles: SxProps<Theme> = (theme) => ({
  borderRadius: '24px',
  bgcolor: theme.palette.mode === 'dark' ? brandColors.darkPaper : '#FFFFFF',
  color: 'text.primary',
  maxWidth: 480,
  width: 'calc(100% - 32px)',
  maxHeight: '88vh',
  display: 'flex',
  flexDirection: 'column',
  m: 2,
  p: { xs: 2.5, sm: 3 },
  position: 'relative',
  overflow: 'hidden',
  boxShadow: theme.palette.mode === 'dark' ? '0 16px 40px rgba(0, 0, 0, 0.6)' : '0 16px 40px rgba(0, 0, 0, 0.15)'
})

export const modalBodyStyles: SxProps<Theme> = {
  flex: 1,
  overflowY: 'auto',
  pr: 0.75,
  mr: -0.75,
  my: 1.5,
  '&::-webkit-scrollbar': {
    width: '6px'
  },
  '&::-webkit-scrollbar-thumb': {
    bgcolor: 'rgba(255, 207, 31, 0.4)',
    borderRadius: '9999px'
  }
}

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
  p: 1.75,
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
  p: 1.75,
  borderRadius: '16px',
  bgcolor: theme.palette.mode === 'dark' ? brandColors.darkSurface : brandColors.sand,
  border: `1px solid ${theme.palette.divider}`,
  gap: 2
})
