import type { SxProps, Theme } from '@mui/material'

export const sectionTitleStyles: SxProps<Theme> = {
  mb: 2,
  fontSize: { xs: '1.125rem', sm: '1.25rem' }
}

export const emptyStateStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: 1.5,
  p: { xs: 3, sm: 5 },
  borderStyle: 'dashed'
}

export const emptyIconWrapperStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: { xs: 56, sm: 64 },
  height: { xs: 56, sm: 64 },
  borderRadius: '50%',
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  mb: 0.5
}

export const emptyIconStyles: SxProps<Theme> = {
  fontSize: { xs: 28, sm: 32 }
}

export const emptyDescriptionStyles: SxProps<Theme> = {
  maxWidth: 420
}

export const emptyButtonStyles: SxProps<Theme> = {
  mt: 1,
  width: { xs: '100%', sm: 'auto' },
  minHeight: 48
}


export const eventsGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
  gap: 2
}

export const eventCardStyles: SxProps<Theme> = {
  p: 0,
  overflow: 'hidden'
}

export const eventCardActionStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 1.25,
  p: 2.5,
  minHeight: 48,
  textAlign: 'left',
  minWidth: 0
}

export const eventCardChipsStyles: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 1
}

export const eventCardNameStyles: SxProps<Theme> = {
  fontWeight: 700,
  overflowWrap: 'anywhere'
}