import type { SxProps, Theme } from '@mui/material'

export const albumPaperStyles: SxProps<Theme> = {
  p: { xs: 2.5, sm: 3 },
  display: 'flex',
  flexDirection: 'column',
  gap: 2
}

export const photosGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
  gap: 1.5
}

export const photoCardStyles: SxProps<Theme> = {
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
  aspectRatio: '1 / 1',
  bgcolor: 'action.hover'
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
  gap: 0.5,
  px: 1,
  py: 0.5,
  color: '#fff',
  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
}

export const photoOverlayNameStyles: SxProps<Theme> = {
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}

export const deletePhotoButtonStyles: SxProps<Theme> = {
  color: '#fff',
  p: 0.5
}
