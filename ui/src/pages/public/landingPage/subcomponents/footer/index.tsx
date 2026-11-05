import { Box, Container, Link, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import {
  footerBoxStyles,
  footerCompanyStyles,
  footerContainerStyles,
  footerCopyrightStyles,
  footerLinkItemStyles,
  footerLinksStyles
} from './styles'
import type { FooterProps } from './types'

const formatCompanyName = (name: string): string => {
  return name.toLowerCase().replace(/(?:^|\s|-)\S/g, char => char.toUpperCase())
}

const formatCnpj = (cnpj: string): string => {
  const digits = cnpj.replace(/\D/g, '')
  if (digits.length === 14) {
    return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
  }
  return cnpj
}

export const Footer = ({ data }: FooterProps) => {
  const copyrightText = data.copyrightSuffix.startsWith('©')
    ? data.copyrightSuffix
    : `© ${new Date().getFullYear()} ${data.copyrightSuffix}`

  const companyInfo = [
    data.companyName ? formatCompanyName(data.companyName) : null,
    data.cnpj ? `CNPJ: ${formatCnpj(data.cnpj)}` : null
  ]
    .filter(Boolean)
    .join(' • ')

  return (
    <Box component="footer" sx={footerBoxStyles}>
      <Container maxWidth="lg" sx={footerContainerStyles}>
        <Typography variant="body2" color="text.secondary" sx={footerCopyrightStyles}>
          {copyrightText}
        </Typography>

        <Stack direction="row" spacing={1.5} sx={footerLinksStyles}>
          <Link component={RouterLink} to="/termos-de-uso" color="text.secondary" sx={footerLinkItemStyles}>
            Termos de Uso
          </Link>
          <Typography variant="body2" color="text.secondary">
            •
          </Typography>
          <Link component={RouterLink} to="/politica-de-cancelamento" color="text.secondary" sx={footerLinkItemStyles}>
            Cancelamento e Reembolso
          </Link>
        </Stack>

        {companyInfo && (
          <Typography variant="body2" color="text.secondary" sx={footerCompanyStyles}>
            {companyInfo}
          </Typography>
        )}
      </Container>
    </Box>
  )
}

export default Footer
