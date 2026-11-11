import type { SxProps, Theme } from '@mui/material'
import { brandColors } from '@styles/theme'

export const storeWrapperStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3
}

export const blockWrapperStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5
}

export const getSingleCreditsGridStyles = (count: number): SxProps<Theme> => ({
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    md: count > 1 ? 'repeat(2, minmax(0, 1fr))' : '1fr'
  },
  gap: 2
})

export const singleCreditCardStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 2.5 },
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'stretch', sm: 'center' },
  justifyContent: 'space-between',
  gap: 2,
  minWidth: 0
}

export const singleCreditInfoStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.5,
  minWidth: 0
}

export const singleCreditTitleRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 1
}

export const singleCreditActionColStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'row', sm: 'row' },
  alignItems: 'center',
  justifyContent: { xs: 'space-between', sm: 'flex-end' },
  gap: 2,
  flexShrink: 0
}

export const singleCreditButtonStyles: SxProps<Theme> = {
  minHeight: 40,
  px: 2.5,
  whiteSpace: 'nowrap'
}

export const subscriptionPlansGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: {
    xs: '1fr',
    md: 'repeat(2, minmax(0, 1fr))'
  },
  gap: 2
}

export const getPlanCardStyles = (highlighted?: boolean): SxProps<Theme> => ({
  p: { xs: 2.25, sm: 2.75 },
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  minWidth: 0,
  ...(highlighted && {
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
  gap: 0.5
}

export const priceNumberStyles: SxProps<Theme> = {
  fontSize: { xs: '1.5rem', sm: '1.75rem' },
  fontWeight: 800,
  lineHeight: 1.1
}

export const featuresListStyles: SxProps<Theme> = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 0.75
}

export const featureRowStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 1
}

export const checkIconStyles: SxProps<Theme> = {
  fontSize: 16,
  color: 'success.main',
  mt: '3px',
  flexShrink: 0
}

export const ctaButtonStyles: SxProps<Theme> = {
  minHeight: 42,
  width: '100%'
}
