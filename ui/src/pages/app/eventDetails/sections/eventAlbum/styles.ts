import type { SxProps, Theme } from '@mui/material'

export const albumCardStyles: SxProps<Theme> = {
  p: { xs: 2.5, sm: 3.5 },
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5
}

export const albumHeaderRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'stretch', sm: 'center' },
  justifyContent: 'space-between',
  gap: 2
}

export const guestFilterFieldStyles: SxProps<Theme> = {
  width: { xs: '100%', sm: 260 },
  flexShrink: 0
}

export const stateBoxStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  gap: 1,
  py: { xs: 4, sm: 5 },
  px: 2.5,
  borderRadius: '18px',
  border: '1px dashed',
  borderColor: 'divider',
  bgcolor: 'action.hover'
}

export const stateIconWrapperStyles: SxProps<Theme> = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bgcolor: 'background.paper',
  border: 1,
  borderColor: 'divider',
  color: 'text.secondary',
  mb: 0.5
}

export const photosGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: {
    xs: 'repeat(2, minmax(0, 1fr))',
    sm: 'repeat(3, minmax(0, 1fr))',
    md: 'repeat(4, minmax(0, 1fr))'
  },
  gap: 1.75
}

export const photoCardStyles: SxProps<Theme> = {
  position: 'relative',
  borderRadius: '16px',
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
  px: 1.25,
  py: 0.75,
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
