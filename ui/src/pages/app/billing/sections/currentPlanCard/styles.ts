import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@theme'

export const sectionBoxStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2
}

export const activePlanCardStyles = (isDark: boolean): SxProps<Theme> => ({
  p: { xs: 2.5, sm: 3.5 },
  display: 'flex',
  flexDirection: 'column',
  gap: 2.5,
  borderWidth: '2px',
  borderColor: brandColors.flashYellow,
  bgcolor: isDark ? brandColors.darkPaper : '#FFFFFF'
})

export const emptyPlanCardStyles: SxProps<Theme> = {
  p: { xs: 2.5, sm: 3 },
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'flex-start', sm: 'center' },
  justifyContent: 'space-between',
  gap: 2
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

export const detailsGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, minmax(0, 1fr))',
    md: 'repeat(4, minmax(0, 1fr))'
  },
  gap: 1.5
}

export const detailTileStyles: SxProps<Theme> = {
  p: 1.75,
  borderRadius: '12px',
  bgcolor: 'action.hover',
  display: 'flex',
  flexDirection: 'column',
  gap: 0.25
}

export const actionsBarStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'stretch', sm: 'center' },
  justifyContent: 'space-between',
  gap: 1.5,
  pt: 1,
  borderTop: 1,
  borderColor: 'divider'
}

export const buttonResponsiveStyles: SxProps<Theme> = {
  minHeight: 48,
  width: { xs: '100%', sm: 'auto' }
}

export const cancelledItemStyles: SxProps<Theme> = {
  p: 2,
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'flex-start', sm: 'center' },
  justifyContent: 'space-between',
  gap: 1
}

export const dialogPaperStyles: SxProps<Theme> = {
  borderRadius: '20px',
  p: 1,
  maxWidth: 480,
  width: 'calc(100% - 32px)',
  m: 2
}

export const dialogActionsStyles: SxProps<Theme> = {
  px: 3,
  pb: 2,
  gap: 1,
  flexDirection: { xs: 'column-reverse', sm: 'row' }
}
