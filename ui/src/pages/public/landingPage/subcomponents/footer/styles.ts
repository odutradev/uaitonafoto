import type { SxProps, Theme } from '@mui/material'

export const footerBoxStyles: SxProps<Theme> = {
  py: { xs: 2.5, sm: 3 },
  borderTop: 1,
  borderColor: 'divider',
  bgcolor: 'background.default',
  mt: 'auto',
  width: '100%'
}

export const footerContainerStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: { xs: 1.5, sm: 2 },
  px: { xs: 2, sm: 3 }
}

export const footerCopyrightStyles: SxProps<Theme> = {
  textAlign: { xs: 'center', md: 'left' },
  whiteSpace: { md: 'nowrap' }
}

export const footerLinksStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: { xs: 1, sm: 1.5 }
}

export const footerLinkItemStyles: SxProps<Theme> = {
  textDecoration: 'none',
  fontSize: '0.875rem',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: 'primary.main',
    textDecoration: 'underline'
  }
}

export const footerCompanyStyles: SxProps<Theme> = {
  textAlign: { xs: 'center', md: 'right' },
  whiteSpace: { md: 'nowrap' }
}
