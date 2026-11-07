import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@theme'

export const storeWrapperStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3.5
}

export const blockWrapperStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2
}

export const singleCreditsGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    md: 'repeat(3, minmax(0, 1fr))'
  },
  gap: 2
}

export const subscriptionPlansGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    md: 'repeat(2, minmax(0, 1fr))'
  },
  gap: 2.5
}

export const getProductCardStyles = (highlighted?: boolean): SxProps<Theme> => ({
  p: { xs: 2.5, sm: 3 },
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  minWidth: 0,
  ...(highlighted && {
    borderWidth: '2px',
    borderColor: brandColors.flashYellow
  })
})

export const cardTopMetaRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 1
}

export const priceLineStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'baseline',
  flexWrap: 'wrap',
  gap: 0.75
}

export const priceNumberStyles: SxProps<Theme> = {
  fontSize: { xs: '1.75rem', sm: '2rem' },
  fontWeight: 800,
  lineHeight: 1.1
}

export const featuresListStyles: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 1
}

export const featureRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 1
}

export const checkIconStyles: SxProps<Theme> = {
  fontSize: 18,
  color: 'success.main',
  mt: '2px',
  flexShrink: 0
}

export const ctaButtonStyles: SxProps<Theme> = {
  minHeight: 48,
  width: '100%'
}
