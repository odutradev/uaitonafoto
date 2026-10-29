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
  switch (iconName) {
    case 'camera':
      return <PhotoCameraIcon sx={{ fontSize: 32 }} />
    case 'tv':
      return <ConnectedTvIcon sx={{ fontSize: 32 }} />
    case 'qr_code':
    default:
      return <QrCodeIcon sx={{ fontSize: 32 }} />
  }
}

export const HowItWorks = ({ data, isDark }: HowItWorksProps) => {
  return (
    <Box sx={getSectionBoxStyles(isDark)}>
      <Container maxWidth="lg">
        <Stack spacing={2} sx={sectionHeaderStyles}>
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
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={getStepIconBoxStyles(isStep2, isDark)}>
                    {renderStepIcon(step.icon)}
                  </Box>
                  <Typography variant="h4" sx={{ fontSize: '1.6rem', color: 'text.primary' }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
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
