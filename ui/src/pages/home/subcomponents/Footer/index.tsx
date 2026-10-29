import { Box, Container, Typography } from '@mui/material'

import Logo from '@components/logo'

import { footerBoxStyles, footerContainerStyles } from './styles'
import type { FooterProps } from './types'

export const Footer = ({ data }: FooterProps) => {
  return (
    <Box component="footer" sx={footerBoxStyles}>
      <Container maxWidth="lg" sx={footerContainerStyles}>
        <Logo size="small" variant="auto" />

        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} {data.copyrightSuffix}
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer

