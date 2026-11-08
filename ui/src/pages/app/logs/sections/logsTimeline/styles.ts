import type { SxProps, Theme } from '@mui/material'

export const timelineSectionStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2
}

export const getLogsStackStyles = (isLoading: boolean): SxProps<Theme> => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
  opacity: isLoading ? 0.6 : 1,
  transition: 'opacity 0.2s ease'
})

export const logCardStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 2.5 },
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  alignItems: { xs: 'stretch', md: 'center' },
  justifyContent: 'space-between',
  gap: 2,
  minWidth: 0
}

export const logInfoColumnStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.75,
  minWidth: 0,
  flex: 1
}

export const logBadgesRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 1
}

export const detailsBtnStyles: SxProps<Theme> = {
  minHeight: 44,
  width: { xs: '100%', md: 'auto' },
  flexShrink: 0
}

export const emptyPaperStyles: SxProps<Theme> = {
  p: { xs: 3, sm: 5 },
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 1
}

