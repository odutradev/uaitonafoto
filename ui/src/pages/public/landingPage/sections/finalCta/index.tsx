import { Box, Button, Container, Typography } from '@mui/material'
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

import Logo from '@components/logo'

import {
  ctaButtonStyles,
  ctaDescriptionStyles,
  ctaTitleStyles,
  getCtaBoxStyles
} from './styles'
import type { FinalCtaProps } from './types'

export const FinalCta = ({ data, isDark }: FinalCtaProps) => {
  return (
    <Container maxWidth="lg" sx={{ pb: { xs: 6, sm: 8, md: 10 }, px: { xs: 2, sm: 3 } }}>
      <Box sx={getCtaBoxStyles(isDark)}>
        <Logo size="large" variant="auto" animation="flash" />

        <Typography variant="h2" sx={ctaTitleStyles}>
          {data.title}
        </Typography>

        <Typography variant="body1" sx={ctaDescriptionStyles}>
          {data.description}
        </Typography>

        <Button
          component={RouterLink}
          to={data.button.href}
          variant="contained"
          color="primary"
          size="large"
          endIcon={<ArrowForwardIcon />}
          sx={ctaButtonStyles}
        >
          {data.button.text}
        </Button>
      </Box>
    </Container>
  )
}

export default FinalCta
