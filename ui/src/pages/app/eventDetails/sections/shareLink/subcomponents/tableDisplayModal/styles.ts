import type { SxProps, Theme } from '@mui/material'

export const dialogPaperStyles: SxProps<Theme> = {
  borderRadius: { xs: 2, sm: 3 },
  maxWidth: 1040,
  width: '100%',
  maxHeight: '94vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundImage: 'none'
}

export const dialogHeaderStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 2.5 },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper'
}

export const dialogContentStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 3 },
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '400px 1fr' },
  gap: 3,
  overflowY: 'auto',
  alignItems: 'start',
  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#14110D' : '#FBF9F5')
}

export const controlsSectionStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2
}

export const controlCardStyles: SxProps<Theme> = {
  p: 2,
  borderRadius: 2.5,
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
  boxShadow: (theme) =>
    theme.palette.mode === 'dark'
      ? '0 2px 8px rgba(0,0,0,0.3)'
      : '0 1px 3px rgba(0,0,0,0.04)'
}

export const controlGroupStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1
}

export const templateSelectorGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 1.25
}

export const templateOptionButtonStyles = (isSelected: boolean): SxProps<Theme> => ({
  p: 1.2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 0.75,
  borderRadius: 2,
  border: '2px solid',
  borderColor: isSelected ? 'primary.main' : 'divider',
  backgroundColor: isSelected
    ? (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 207, 31, 0.12)' : 'rgba(255, 207, 31, 0.18)')
    : 'background.default',
  color: isSelected ? 'text.primary' : 'text.secondary',
  cursor: 'pointer',
  transition: 'all 0.18s ease-in-out',
  outline: 'none',
  boxShadow: isSelected ? '0 0 0 1px #FFCF1F' : 'none',
  '&:hover': {
    borderColor: isSelected ? 'primary.main' : 'text.disabled',
    transform: 'translateY(-1px)'
  }
})

export const previewWrapperStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  p: { xs: 2, sm: 3 },
  borderRadius: 3,
  bgcolor: (theme) =>
    theme.palette.mode === 'dark' ? '#1B1712' : '#EFECE6',
  border: '1px solid',
  borderColor: 'divider',
  minHeight: { xs: 460, md: 560 },
  position: 'relative',
  overflow: 'hidden'
}

export const dialogActionsStyles: SxProps<Theme> = {
  p: { xs: 1.5, sm: 2 },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderTop: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
  flexWrap: 'wrap',
  gap: 1
}

export const dialogActionButtonStyles: SxProps<Theme> = {
  minHeight: 38,
  px: 2,
  py: 0.75,
  fontSize: '0.8125rem',
  fontWeight: 700,
  borderRadius: '10px'
}
