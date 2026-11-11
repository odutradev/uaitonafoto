import { Box, Card, Container, Stack, Typography } from '@mui/material'
import { AutoAwesome as AutoAwesomeIcon, CloudDownloadOutlined as DownloadIcon, ConnectedTvOutlined as TvIcon, EmojiEventsOutlined as TrophyIcon, PrintOutlined as PrintIcon, SecurityOutlined as SecurityIcon, StorefrontOutlined as StoreIcon } from '@mui/icons-material'

import { cardBadgeStyles, featuresGridStyles, getFeatureCardStyles, getFeatureIconBoxStyles, getSectionBoxStyles, sectionHeaderStyles, sectionSubtitleStyles, sectionTitleStyles, tagBadgeStyles } from './styles'
import useLandingPage from '@pages/public/landingPage/hook'

const renderFeatureIcon = (iconName: string) => {
  const iconSx = { fontSize: 24 }
  switch (iconName) {
    case 'tv':
      return <TvIcon sx={iconSx} />
    case 'challenges':
      return <TrophyIcon sx={iconSx} />
    case 'moderation':
      return <SecurityIcon sx={iconSx} />
    case 'print':
      return <PrintIcon sx={iconSx} />
    case 'whitelabel':
      return <StoreIcon sx={iconSx} />
    case 'download':
      return <DownloadIcon sx={iconSx} />
    default:
      return <AutoAwesomeIcon sx={iconSx} />
  }
}

export const Features = () => {
  const { isDark, data: content } = useLandingPage()
  const data = content.features

  return (
    <Box id="recursos" component="section" sx={getSectionBoxStyles(isDark)}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Stack spacing={1.75} sx={sectionHeaderStyles}>
          <Box sx={tagBadgeStyles}>
            <AutoAwesomeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            {data.tag}
          </Box>
          <Typography variant="h2" sx={sectionTitleStyles}>
            {data.title}
          </Typography>
          <Typography variant="body1" sx={sectionSubtitleStyles}>
            {data.subtitle}
          </Typography>
        </Stack>

        <Box sx={featuresGridStyles}>
          {data.items.map((item) => (
            <Card key={item.id} elevation={0} sx={getFeatureCardStyles(isDark)}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={getFeatureIconBoxStyles(isDark)}>
                  {renderFeatureIcon(item.icon)}
                </Box>
                {item.badge && <Box sx={cardBadgeStyles}>{item.badge}</Box>}
              </Box>

              <Typography variant="h4" sx={{ fontSize: { xs: '1.2rem', sm: '1.35rem' }, fontWeight: 700, color: 'text.primary' }}>
                {item.title}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                {item.description}
              </Typography>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  )
}

export default Features
