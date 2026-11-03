import { Box, Container, Typography } from '@mui/material'

import Logo from '@components/logo'

import { footerBoxStyles, footerContainerStyles, footerInfoStyles } from './styles'
import type { FooterProps } from './types'

export const Footer = ({ data }: FooterProps) => {
  return (
    <Box component="footer" sx={footerBoxStyles}>
      <Container maxWidth="lg" sx={footerContainerStyles}>
        <Logo size="small" variant="auto" animation="breathe" />

        <Box sx={footerInfoStyles}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {data.copyrightSuffix}
          </Typography>

          {(data.companyName || data.cnpj) && (
            <Typography variant="caption" color="text.secondary">
              {[data.companyName, data.cnpj ? `CNPJ: ${data.cnpj}` : null].filter(Boolean).join(' • ')}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
