import type { SxProps, Theme } from '@mui/material'

export const historyWrapperStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5
}

export const headerFilterBarStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  alignItems: { xs: 'stretch', md: 'center' },
  justifyContent: 'space-between',
  gap: 2
}

export const filtersRowStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  gap: 1.5
}

export const filterSelectStyles: SxProps<Theme> = {
  minWidth: { xs: '100%', sm: 190 }
}

export const getListContainerStyles = (isLoading: boolean): SxProps<Theme> => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
  opacity: isLoading ? 0.6 : 1,
  transition: 'opacity 0.2s ease'
})

export const transactionRowCardStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 2.5 },
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  alignItems: { xs: 'stretch', md: 'center' },
  justifyContent: 'space-between',
  gap: 2,
  minWidth: 0
}

export const rowMainInfoStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.75,
  minWidth: 0
}

export const rowTitleBadgesStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 1
}

export const rowActionsStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'stretch', sm: 'center' },
  gap: 1,
  flexShrink: 0
}

export const rowButtonStyles: SxProps<Theme> = {
  minHeight: 44,
  width: { xs: '100%', sm: 'auto' }
}

export const emptyBoxStyles: SxProps<Theme> = {
  p: { xs: 3, sm: 5 },
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 1
}

export const paginationRowStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  pt: 1
}
