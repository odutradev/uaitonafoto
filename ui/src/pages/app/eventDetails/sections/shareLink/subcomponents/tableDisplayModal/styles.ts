import type { SxProps, Theme } from '@mui/material'

export const dialogPaperStyles: SxProps<Theme> = {
  borderRadius: 3,
  maxWidth: 960,
  width: '100%',
  maxHeight: '92vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
}

export const dialogHeaderStyles: SxProps<Theme> = {
  p: 2.5,
  pb: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid',
  borderColor: 'divider'
}

export const dialogContentStyles: SxProps<Theme> = {
  p: 3,
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '360px 1fr' },
  gap: 3,
  overflowY: 'auto',
  alignItems: 'start'
}

export const controlsSectionStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5
}

export const controlGroupStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1
}

export const templateSelectorGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 1
}

export const templateOptionButtonStyles = (isSelected: boolean): SxProps<Theme> => ({
  p: 1.2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 0.6,
  borderRadius: 2,
  border: '2px solid',
  borderColor: isSelected ? 'primary.main' : 'divider',
  backgroundColor: isSelected ? 'action.selected' : 'background.paper',
  cursor: 'pointer',
  transition: 'all 0.15s ease-in-out',
  textTransform: 'none',
  '&:hover': {
    borderColor: isSelected ? 'primary.main' : 'text.secondary'
  }
})

export const previewWrapperStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  p: { xs: 2, md: 3 },
  borderRadius: 3,
  backgroundColor: 'grey.100',
  minHeight: 520,
  position: 'relative'
}

export const dialogActionsStyles: SxProps<Theme> = {
  p: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderTop: '1px solid',
  borderColor: 'divider',
  flexWrap: 'wrap',
  gap: 1
}

export const dialogActionButtonStyles: SxProps<Theme> = {
  minHeight: 36,
  px: 1.75,
  py: 0.75,
  fontSize: '0.8125rem',
  fontWeight: 600,
  borderRadius: '10px',
  borderWidth: '1px',
  '&:hover': {
    borderWidth: '1px'
  }
}

