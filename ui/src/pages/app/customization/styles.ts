import type { SxProps, Theme } from '@mui/material'

export const customizationRootStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  maxWidth: 1100,
  mx: 'auto',
  width: '100%',
  pb: 6
}

export const headerBoxStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.75
}

export const mainGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', lg: '1.15fr 0.85fr' },
  gap: 3,
  alignItems: 'start'
}

export const formCardStyles: SxProps<Theme> = {
  p: { xs: 2.5, sm: 3.5 },
  borderRadius: '20px',
  border: 1,
  borderColor: 'divider',
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5
}

export const previewCardStyles: SxProps<Theme> = {
  p: { xs: 2.5, sm: 3 },
  borderRadius: '20px',
  border: 1,
  borderColor: 'divider',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  position: 'sticky',
  top: 24
}

export const switchCardStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 2,
  p: 2,
  borderRadius: '16px',
  border: 1,
  borderColor: 'divider',
  bgcolor: 'action.hover'
}

export const previewFrameStyles: SxProps<Theme> = {
  borderRadius: '16px',
  border: 1,
  borderColor: 'divider',
  overflow: 'hidden',
  bgcolor: '#12100C',
  color: '#FBF8F1',
  p: 2.5,
  display: 'flex',
  flexDirection: 'column',
  gap: 2
}

export const whatsappPreviewButtonStyles: SxProps<Theme> = {
  bgcolor: '#25D366',
  color: '#FFFFFF',
  fontWeight: 700,
  fontSize: '0.85rem',
  textTransform: 'none',
  borderRadius: '9999px',
  px: 2,
  py: 0.75,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.75,
  '&:hover': {
    bgcolor: '#20BA5A'
  }
}

