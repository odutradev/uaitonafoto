import type { SxProps, Theme } from '@mui/material'

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
