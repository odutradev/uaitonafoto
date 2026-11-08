import type { SxProps, Theme } from '@mui/material'

export const historyWrapperStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2
}

export const headerFilterBarStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'stretch', sm: 'center' },
  justifyContent: 'space-between',
  gap: 1.5
}

export const filtersRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  gap: 1.25
}

export const filterSelectStyles: SxProps<Theme> = {
  minWidth: { xs: '100%', sm: 165 }
}

export const getListCardStyles = (isLoading: boolean): SxProps<Theme> => ({
  overflow: 'hidden',
  opacity: isLoading ? 0.6 : 1,
  transition: 'opacity 0.2s ease'
})

export const getTransactionRowStyles = (isLast: boolean): SxProps<Theme> => ({
  px: { xs: 2, sm: 2.5 },
  py: 1.75,
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'stretch', sm: 'center' },
  justifyContent: 'space-between',
  gap: 1.5,
  minWidth: 0,
  ...(!isLast && {
    borderBottom: 1,
    borderColor: 'divider'
  })
})

export const rowMainInfoStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.25,
  minWidth: 0
}

export const rowTitleBadgesStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 0.75
}

export const rowRightColStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: { xs: 'space-between', sm: 'flex-end' },
  flexWrap: 'wrap',
  gap: 1.5,
  flexShrink: 0
}

export const rowActionsStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.75
}

export const rowButtonStyles: SxProps<Theme> = {
  minHeight: 34,
  px: 1.5,
  py: 0.5,
  fontSize: '0.8125rem'
}

export const chipCompactStyles: SxProps<Theme> = {
  fontWeight: 700,
  height: 20,
  fontSize: '0.7rem'
}

export const emptyBoxStyles: SxProps<Theme> = {
  p: { xs: 3, sm: 4 },
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 0.5
}
