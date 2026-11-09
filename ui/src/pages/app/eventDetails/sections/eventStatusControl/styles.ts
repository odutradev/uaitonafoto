import { brandColors } from '@theme'
import type { SxProps, Theme } from '@mui/material'

export const statusControlCardStyles: SxProps<Theme> = (theme) => ({
  p: { xs: 2, sm: 2.5 },
  borderRadius: '20px',
  bgcolor: theme.palette.mode === 'dark' ? brandColors.darkPaper : '#FFFFFF',
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  alignItems: { xs: 'flex-start', md: 'center' },
  justifyContent: 'space-between',
  gap: 2,
  mb: 2.5
})

export const statusInfoColumnStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.75,
  minWidth: 0
}

export const statusHeaderRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 1.25
}

export const statusActionRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  flexShrink: 0,
  width: { xs: '100%', md: 'auto' },
  justifyContent: { xs: 'flex-start', md: 'flex-end' }
}

export const liveDotStyles: SxProps<Theme> = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  bgcolor: '#22c55e',
  boxShadow: '0 0 8px #22c55e',
  display: 'inline-block'
}

