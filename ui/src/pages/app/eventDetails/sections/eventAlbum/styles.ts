import type { SxProps, Theme } from '@mui/material'

export const albumCardStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 3 },
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 2
}

export const albumHeaderRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'stretch', sm: 'center' },
  justifyContent: 'space-between',
  gap: 1.5
}

export const guestFilterFieldStyles: SxProps<Theme> = {
  width: { xs: '100%', sm: 220 },
  flexShrink: 0
}

export const downloadZipButtonStyles: SxProps<Theme> = {
  minHeight: 38,
  px: 1.75,
  py: 0.75,
  fontSize: '0.8125rem',
  fontWeight: 600,
  borderRadius: '10px',
  whiteSpace: 'nowrap'
}

export const stateBoxStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  gap: 0.75,
  py: { xs: 3.5, sm: 4.5 },
  px: 2,
  borderRadius: '12px',
  border: '1px dashed',
  borderColor: 'divider',
  bgcolor: 'action.hover'
}

export const stateIconWrapperStyles: SxProps<Theme> = {
  width: 38,
  height: 38,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bgcolor: 'background.paper',
  border: 1,
  borderColor: 'divider',
  color: 'text.secondary',
  mb: 0.25
}

export const photosGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: {
    xs: 'repeat(2, minmax(0, 1fr))',
    sm: 'repeat(3, minmax(0, 1fr))',
    md: 'repeat(4, minmax(0, 1fr))'
  },
  gap: 1.5
}

export const photoCardStyles: SxProps<Theme> = {
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
  aspectRatio: '1 / 1',
  bgcolor: 'action.hover',
  border: 1,
  borderColor: 'divider'
}

export const photoImageStyles: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block'
}

export const photoOverlayStyles: SxProps<Theme> = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 0.75,
  px: 1,
  py: 0.6,
  color: '#fff',
  background: 'linear-gradient(transparent, rgba(0,0,0,0.75))'
}

export const photoOverlayNameStyles: SxProps<Theme> = {
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontWeight: 600
}

export const deletePhotoButtonStyles: SxProps<Theme> = {
  color: '#fff',
  p: 0.5,
  '&:hover': {
    bgcolor: 'rgba(255,255,255,0.16)'
  }
}

export const approvePhotoButtonStyles: SxProps<Theme> = {
  bgcolor: 'success.main',
  color: '#fff',
  p: 0.5,
  '&:hover': {
    bgcolor: 'success.dark'
  }
}

export const rejectPhotoButtonStyles: SxProps<Theme> = {
  bgcolor: 'error.main',
  color: '#fff',
  p: 0.5,
  '&:hover': {
    bgcolor: 'error.dark'
  }
}

export const moderationBarStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 1,
  pb: 0.5
}

export const moderationTabsStyles: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
  flexWrap: 'wrap',
  p: 0.5,
  borderRadius: '10px',
  bgcolor: 'action.hover',
  border: 1,
  borderColor: 'divider'
}

export const moderationFilterButtonStyles = (active: boolean): SxProps<Theme> => ({
  minHeight: 30,
  px: 1.25,
  py: 0.4,
  borderRadius: '7px',
  fontSize: '0.78rem',
  fontWeight: active ? 700 : 500,
  color: active ? 'text.primary' : 'text.secondary',
  bgcolor: active ? 'background.paper' : 'transparent',
  border: active ? 1 : 0,
  borderColor: 'divider',
  '&:hover': {
    bgcolor: active ? 'background.paper' : 'action.selected'
  }
})

export const approveAllButtonStyles: SxProps<Theme> = {
  minHeight: 32,
  px: 1.5,
  py: 0.5,
  fontSize: '0.78rem',
  fontWeight: 600,
  borderRadius: '8px'
}

export const photoStatusBadgeStyles = (status: 'pending' | 'approved' | 'rejected'): SxProps<Theme> => ({
  position: 'absolute',
  top: 8,
  left: 8,
  zIndex: 2,
  fontWeight: 700,
  fontSize: '0.68rem',
  height: 20,
  px: 0.75,
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: '6px',
  color: '#fff',
  bgcolor:
    status === 'pending'
      ? 'warning.dark'
      : status === 'approved'
        ? 'success.dark'
        : 'error.dark'
})

