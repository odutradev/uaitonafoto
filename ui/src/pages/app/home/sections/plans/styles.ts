import type { SxProps, Theme } from '@mui/material'

export const sectionTitleStyles: SxProps<Theme> = {
  fontSize: { xs: '1.125rem', sm: '1.25rem' }
}

export const sectionHeaderStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'flex-start', sm: 'center' },
  justifyContent: 'space-between',
  gap: 1.5,
  mb: 2
}

export const creditsWrapperStyles: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 1
}

export const creditsChipStyles: SxProps<Theme> = {
  fontWeight: 700
}

export const plansGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
  gap: { xs: 2, sm: 2.5 }
}

export const getPlanCardStyles = (highlighted: boolean): SxProps<Theme> => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  p: { xs: 2.5, sm: 3 },
  border: '1px solid',
  borderColor: highlighted ? 'primary.main' : 'divider',
  borderWidth: highlighted ? 2 : 1,
  borderRadius: '16px'
})

export const planBadgeStyles: SxProps<Theme> = {
  alignSelf: 'flex-start',
  mb: 1,
  fontWeight: 800
}

export const planTitleStyles: SxProps<Theme> = {
  fontSize: { xs: '1.125rem', sm: '1.25rem' },
  fontWeight: 800,
  overflowWrap: 'anywhere'
}

export const priceContainerStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'baseline',
  flexWrap: 'wrap',
  gap: 0.75,
  my: 1.5
}

export const priceTextStyles: SxProps<Theme> = {
  fontSize: { xs: '1.75rem', sm: '2rem' },
  fontWeight: 800,
  lineHeight: 1.1
}

export const planDescriptionStyles: SxProps<Theme> = {
  mb: 2
}

export const featuresStyles: SxProps<Theme> = {
  flex: 1,
  mb: 3
}

export const featureItemStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 1
}

export const checkIconStyles: SxProps<Theme> = {
  fontSize: 18,
  mt: '2px',
  color: 'primary.main',
  flexShrink: 0
}

export const buyButtonStyles: SxProps<Theme> = {
  width: '100%',
  minHeight: 48,
  fontWeight: 700
}
