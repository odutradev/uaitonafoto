import type { SxProps, Theme } from '@mui/material'

export const sectionBoxStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5
}

export const activePlanCardStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 2.5 },
  display: 'flex',
  flexDirection: 'column',
  gap: 1.75
}

export const topHeaderRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'flex-start', sm: 'center' },
  justifyContent: 'space-between',
  gap: 1.5
}

export const titleChipsRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 1
}

export const metaRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1.5,
  pt: 1.5,
  borderTop: 1,
  borderColor: 'divider'
}

export const metaItemsStyles: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: 3,
  rowGap: 0.75
}

export const cancelButtonStyles: SxProps<Theme> = {
  minHeight: 36,
  px: 1.75,
  py: 0.5,
  fontSize: '0.8125rem',
  width: { xs: '100%', sm: 'auto' }
}

export const dialogButtonStyles: SxProps<Theme> = {
  minHeight: 44,
  width: { xs: '100%', sm: 'auto' }
}

export const dialogPaperStyles: SxProps<Theme> = {
  borderRadius: '20px',
  p: 1,
  maxWidth: 460,
  width: 'calc(100% - 32px)',
  m: 2
}

export const dialogActionsStyles: SxProps<Theme> = {
  px: 3,
  pb: 2,
  gap: 1,
  flexDirection: { xs: 'column-reverse', sm: 'row' }
}
