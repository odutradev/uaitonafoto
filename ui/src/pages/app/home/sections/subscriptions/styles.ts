import type { SxProps, Theme } from '@mui/material'

export const sectionTitleStyles: SxProps<Theme> = {
  fontSize: { xs: '1.125rem', sm: '1.25rem' },
  mb: 2
}

export const listStackStyles: SxProps<Theme> = {
  gap: 2
}

export const subscriptionCardStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'stretch', sm: 'center' },
  justifyContent: 'space-between',
  gap: 2,
  p: { xs: 2.5, sm: 3 },
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: '16px'
}

export const infoBoxStyles: SxProps<Theme> = {
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 0.75
}

export const titleRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 1
}

export const planNameStyles: SxProps<Theme> = {
  fontSize: { xs: '1rem', sm: '1.125rem' },
  fontWeight: 800,
  overflowWrap: 'anywhere'
}

export const statusChipStyles: SxProps<Theme> = {
  fontWeight: 700
}

export const cancelButtonStyles: SxProps<Theme> = {
  width: { xs: '100%', sm: 'auto' },
  minHeight: 48,
  fontWeight: 700,
  flexShrink: 0
}

export const dialogPaperStyles: SxProps<Theme> = {
  borderRadius: '16px',
  p: 0.5
}

export const dialogActionsStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column-reverse', sm: 'row' },
  gap: 1.5,
  px: 3,
  pb: 2.5,
  pt: 1
}

export const dialogButtonStyles: SxProps<Theme> = {
  width: { xs: '100%', sm: 'auto' },
  minHeight: 48,
  fontWeight: 700,
  m: '0 !important'
}

