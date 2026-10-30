import { Box, Card, CardContent, Container, Stack, Typography } from '@mui/material'
import {
  ConnectedTv as ConnectedTvIcon,
  PhotoCamera as PhotoCameraIcon,
  QrCode2 as QrCodeIcon
} from '@mui/icons-material'

import {
  getSectionBoxStyles,
  getStepIconBoxStyles,
  sectionHeaderStyles,
  sectionSubtitleStyles,
  sectionTitleStyles,
  stepCardStyles,
  stepsGridStyles
} from './styles'
import type { HowItWorksProps } from './types'

const renderStepIcon = (iconName: string) => {
  const iconSx = { fontSize: { xs: 26, sm: 32 } }
  switch (iconName) {
    case 'camera':
      return <PhotoCameraIcon sx={iconSx} />
    case 'tv':
      return <ConnectedTvIcon sx={iconSx} />
    case 'qr_code':
    default:
      return <QrCodeIcon sx={iconSx} />
  }
}

export const HowItWorks = ({ data, isDark }: HowItWorksProps) => {
  return (
    <Box sx={getSectionBoxStyles(isDark)}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.5} sx={sectionHeaderStyles}>
          <Typography variant="h2" sx={sectionTitleStyles}>
            {data.title}
          </Typography>
          <Typography variant="body1" sx={sectionSubtitleStyles}>
            {data.subtitle}
          </Typography>
        </Stack>

        <Box sx={stepsGridStyles}>
          {data.steps.map((step, index) => {
            const isStep2 = index === 1

            return (
              <Card key={step.id || step.title} elevation={0} sx={stepCardStyles}>
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 }, p: { xs: 2, sm: 2.5 } }}>
                  <Box sx={getStepIconBoxStyles(isStep2, isDark)}>
                    {renderStepIcon(step.icon)}
                  </Box>
                  <Typography variant="h4" sx={{ fontSize: { xs: '1.35rem', sm: '1.6rem' }, color: 'text.primary' }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' }, lineHeight: 1.6, color: 'text.secondary' }}>
                    {step.description}
                  </Typography>
                </CardContent>
              </Card>
            )
          })}
        </Box>
      </Container>
    </Box>
  )
}

export default HowItWorks
