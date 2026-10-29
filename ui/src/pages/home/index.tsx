import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  ArrowForward as ArrowForwardIcon,
  ConnectedTv as ConnectedTvIcon,
  Favorite as FavoriteIcon,
  PhotoCamera as PhotoCameraIcon,
  QrCode2 as QrCodeIcon
} from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

import { BrandSymbol, Logo, ThemeToggle } from '@components/index'
import { brandColors } from '@theme/theme'
import {
  finalCtaData,
  footerData,
  guestFeedData,
  headerData,
  heroData,
  howItWorksData,
  liveWallData
} from './data'

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

const Home = () => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const liveWallAccent = isDark ? brandColors.amareloFlash : brandColors.tinta
  const mosaicTiles = isDark
    ? [brandColors.darkSurface, brandColors.darkBorder, brandColors.darkPaper]
    : [brandColors.areia, brandColors.areiaDark, brandColors.bordaClara]

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Box
        component="header"
        sx={{
          py: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: isDark ? 'rgba(18, 16, 12, 0.85)' : 'rgba(251, 248, 241, 0.85)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(10px)'
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <RouterLink to="/" style={{ textDecoration: 'none' }}>
            <Logo size="medium" variant="auto" />
          </RouterLink>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <ThemeToggle />

            <Button
              component={RouterLink}
              to={headerData.loginButton.href}
              variant="contained"
              color="primary"
              size="medium"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 2.5,
                fontWeight: 800,
                fontSize: '0.9375rem'
              }}
            >
              {headerData.loginButton.text}
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 6, md: 9 } }}>
        <Stack spacing={3.5} alignItems="center" textAlign="center" maxWidth="860px" mx="auto">
          <Chip
            icon={
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: isDark ? brandColors.amareloFlash : brandColors.tinta,
                  ml: 1
                }}
              />
            }
            label={heroData.tag}
            sx={{
              bgcolor: isDark ? brandColors.darkSurface : brandColors.areia,
              color: isDark ? brandColors.amareloFlash : brandColors.tinta,
              fontWeight: 700,
              fontSize: '0.875rem',
              letterSpacing: '0.02em',
              py: 2.2,
              px: 1,
              borderRadius: '9999px',
              border: 1,
              borderColor: 'divider'
            }}
          />

          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.75rem', md: '4.75rem' },
              letterSpacing: '-0.05em',
              lineHeight: { xs: 1.08, md: 0.98 },
              color: 'text.primary'
            }}
          >
            {heroData.title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1.125rem', md: '1.3rem' },
              lineHeight: 1.55,
              color: 'text.secondary',
              maxWidth: '680px'
            }}
          >
            {heroData.description}
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ pt: 1.5, width: { xs: '100%', sm: 'auto' } }}
          >
            <Button
              component={RouterLink}
              to={heroData.primaryCta.href}
              variant="contained"
              color="primary"
              size="large"
              sx={{
                height: 56,
                px: 4,
                fontSize: '1.125rem',
                fontWeight: 800
              }}
              endIcon={<ArrowForwardIcon />}
            >
              {heroData.primaryCta.text}
            </Button>

            <Button
              component={RouterLink}
              to={heroData.secondaryCta.href}
              variant="outlined"
              size="large"
              sx={{
                height: 56,
                px: 4,
                fontSize: '1.125rem',
                fontWeight: 700
              }}
            >
              {heroData.secondaryCta.text}
            </Button>
          </Stack>
        </Stack>
      </Container>

      <Box
        sx={{
          bgcolor: isDark ? brandColors.darkSurface : brandColors.areia,
          py: { xs: 8, md: 10 },
          borderTop: 1,
          borderBottom: 1,
          borderColor: 'divider',
          transition: 'background-color 0.3s ease'
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={2} textAlign="center" alignItems="center" mb={6}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.75rem' },
                color: 'text.primary'
              }}
            >
              {howItWorksData.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                maxWidth: '540px',
                fontSize: '1.1rem',
                color: 'text.secondary'
              }}
            >
              {howItWorksData.subtitle}
            </Typography>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3.5
            }}
          >
            {howItWorksData.steps.map((step, index) => {
              const isStep2 = index === 1
              const iconBg = isStep2
                ? isDark
                  ? brandColors.amareloFlash
                  : brandColors.tinta
                : brandColors.amareloFlash
              const iconColor = isStep2
                ? isDark
                  ? brandColors.tinta
                  : brandColors.amareloFlash
                : brandColors.tinta

              return (
                <Card
                  key={step.id || step.title}
                  elevation={0}
                  sx={{
                    borderRadius: '24px',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '16px',
                        bgcolor: iconBg,
                        color: iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
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

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.35fr 1fr' },
            gap: 4,
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              bgcolor: isDark ? brandColors.darkBg : 'background.paper',
              color: 'text.primary',
              borderRadius: '28px',
              p: { xs: 3, md: 4.5 },
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              border: 1,
              borderColor: 'divider',
              boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.4)' : '0 20px 40px rgba(23, 20, 15, 0.08)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <BrandSymbol size={32} variant="auto" />
                <Typography
                  sx={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    letterSpacing: '-0.04em',
                    color: liveWallAccent
                  }}
                >
                  {liveWallData.brandName}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: liveWallAccent,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}
              >
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: liveWallAccent }} />
                {liveWallData.badge}
              </Box>
            </Box>

            <Box
              sx={{
                bgcolor: isDark ? brandColors.darkPaper : brandColors.areia,
                borderRadius: '20px',
                p: { xs: 3, sm: 4 },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 3,
                textAlign: { xs: 'center', sm: 'left' },
                minHeight: 220,
                border: 1,
                borderColor: 'divider'
              }}
            >
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    color: liveWallAccent,
                    fontSize: { xs: '1.75rem', sm: '2.1rem' },
                    mb: 1
                  }}
                >
                  {liveWallData.title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: '420px', lineHeight: 1.5 }}>
                  {liveWallData.description}
                </Typography>
              </Box>

              <Stack spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
                <QrCodeIcon sx={{ fontSize: { xs: 80, sm: 96 }, color: 'primary.main' }} />
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', fontWeight: 700, textAlign: 'center', maxWidth: 130 }}
                >
                  {liveWallData.qrInstruction}
                </Typography>
              </Stack>
            </Box>

            <Stack direction="row" spacing={1.5}>
              <Box sx={{ flex: 1, height: 48, bgcolor: mosaicTiles[0], borderRadius: '12px' }} />
              <Box sx={{ flex: 1, height: 48, bgcolor: mosaicTiles[1], borderRadius: '12px' }} />
              <Box sx={{ flex: 1, height: 48, bgcolor: mosaicTiles[2], borderRadius: '12px' }} />
              <Box sx={{ flex: 1, height: 48, bgcolor: mosaicTiles[0], borderRadius: '12px' }} />
            </Stack>
          </Box>

          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: '28px',
              p: { xs: 3, sm: 4 },
              border: 1,
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5
            }}
          >
            <Chip
              label={guestFeedData.badge}
              sx={{
                alignSelf: 'flex-start',
                bgcolor: isDark ? brandColors.darkSurface : brandColors.areia,
                color: 'text.primary',
                fontWeight: 700
              }}
            />
            <Typography variant="h3" sx={{ fontSize: { xs: '1.75rem', sm: '2.2rem' }, color: 'text.primary' }}>
              {guestFeedData.title}
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
              {guestFeedData.description}
            </Typography>

            <Box
              sx={{
                bgcolor: isDark ? brandColors.darkSurface : brandColors.papel,
                p: 2.5,
                borderRadius: '20px',
                border: 1,
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Stack spacing={0.5}>
                <Typography variant="subtitle1" fontWeight={800} color="text.primary">
                  {guestFeedData.activityCard.action}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {guestFeedData.activityCard.timeAgo}
                </Typography>
              </Stack>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  bgcolor: brandColors.amareloFlash,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: brandColors.tinta
                }}
              >
                <FavoriteIcon sx={{ fontSize: 22 }} />
              </Box>
            </Box>

            <Button
              component={RouterLink}
              to={guestFeedData.cta.href}
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ height: 52, fontWeight: 800 }}
            >
              {guestFeedData.cta.text}
            </Button>
          </Box>
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 10 } }}>
        <Box
          sx={{
            bgcolor: isDark ? brandColors.darkPaper : brandColors.areia,
            color: 'text.primary',
            borderRadius: '32px',
            p: { xs: 4, sm: 6, md: 8 },
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3.5,
            border: 1,
            borderColor: 'divider',
            boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.3)' : '0 20px 40px rgba(23, 20, 15, 0.08)'
          }}
        >
          <Logo size="large" variant="auto" />

          <Typography
            variant="h2"
            sx={{
              color: 'text.primary',
              fontSize: { xs: '2rem', sm: '3rem', md: '3.75rem' },
              maxWidth: '780px'
            }}
          >
            {finalCtaData.title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              maxWidth: '560px'
            }}
          >
            {finalCtaData.description}
          </Typography>

          <Button
            component={RouterLink}
            to={finalCtaData.button.href}
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              height: 58,
              px: 5,
              fontSize: '1.2rem',
              fontWeight: 800,
              mt: 1
            }}
          >
            {finalCtaData.button.text}
          </Button>
        </Box>
      </Container>

      <Box
        component="footer"
        sx={{
          py: 4,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.default',
          mt: 'auto'
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Logo size="small" variant="auto" />

          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {footerData.copyrightSuffix}
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default Home
