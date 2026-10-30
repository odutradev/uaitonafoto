import { Box, Button, Chip, Container, Stack, Typography } from '@mui/material'
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'
import { brandColors } from '@theme'

import {
  getChipStyles,
  heroContainerStyles,
  heroDescriptionStyles,
  heroStackStyles,
  heroTitleStyles,
  primaryButtonStyles,
  secondaryButtonStyles
} from './styles'
import type { HeroProps } from './types'

export const Hero = ({ data, isDark }: HeroProps) => {
  return (
    <Container maxWidth="lg" sx={heroContainerStyles}>
      <Stack spacing={{ xs: 2.5, sm: 3.5 }} alignItems="center" textAlign="center" sx={heroStackStyles}>
        <Chip
          icon={
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: isDark ? brandColors.flashYellow : brandColors.ink,
                ml: 1
              }}
            />
          }
          label={data.tag}
          sx={getChipStyles(isDark)}
        />

        <Typography variant="h1" component="h1" sx={heroTitleStyles}>
          {data.title}
        </Typography>

        <Typography variant="body1" sx={heroDescriptionStyles}>
          {data.description}
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ pt: 1.5, width: { xs: '100%', sm: 'auto' } }}
        >
          <Button
            component={RouterLink}
            to={data.primaryCta.href}
            variant="contained"
            color="primary"
            size="large"
            sx={primaryButtonStyles}
            endIcon={<ArrowForwardIcon />}
          >
            {data.primaryCta.text}
          </Button>

          <Button
            component={RouterLink}
            to={data.secondaryCta.href}
            variant="outlined"
            size="large"
            sx={secondaryButtonStyles}
          >
            {data.secondaryCta.text}
          </Button>
        </Stack>
      </Stack>
    </Container>
  )
}

export default Hero
