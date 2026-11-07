import type { SxProps, Theme } from '@mui/material'

export const dialogPaperStyles: SxProps<Theme> = {
  borderRadius: '20px',
  maxWidth: 540,
  width: 'calc(100% - 32px)',
  m: 2
}

export const formFieldsStackStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2.25,
  pt: 1
}

export const twoColsRowStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
  gap: 2
}

export const dialogActionsStyles: SxProps<Theme> = {
  px: 3,
  pb: 2.5,
  gap: 1,
  flexDirection: { xs: 'column-reverse', sm: 'row' }
}

export const dialogButtonStyles: SxProps<Theme> = {
  minHeight: 48,
  width: { xs: '100%', sm: 'auto' }
}
