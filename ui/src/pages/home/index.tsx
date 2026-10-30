import { Box, Container } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { brandColors } from '@theme'
import {
  finalCtaData,
  footerData,
  guestFeedData,
  headerData,
  heroData,
  howItWorksData,
  liveWallData
} from './data'
import {
  FinalCta,
  Footer,
  GuestFeed,
  Hero,
  HowItWorks,
  LiveWall,
  Navbar
} from './subcomponents'

const Home = () => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const liveWallAccent = isDark ? brandColors.flashYellow : brandColors.ink
  const mosaicTiles = isDark
    ? [brandColors.darkSurface, brandColors.darkBorder, brandColors.darkPaper]
    : [brandColors.sand, brandColors.sandDark, brandColors.lightBorder]

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        overflowX: 'hidden',
        width: '100%'
      }}
    >
      <Navbar data={headerData} isDark={isDark} />
      <Hero data={heroData} isDark={isDark} />
      <HowItWorks data={howItWorksData} isDark={isDark} />

      <Container maxWidth="lg" sx={{ py: { xs: 6, sm: 8, md: 12 }, px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.35fr 1fr' },
            gap: { xs: 3, md: 4 },
            alignItems: 'stretch',
            width: '100%'
          }}
        >
          <LiveWall
            data={liveWallData}
            isDark={isDark}
            liveWallAccent={liveWallAccent}
            mosaicTiles={mosaicTiles}
          />
          <GuestFeed data={guestFeedData} isDark={isDark} />
        </Box>
      </Container>

      <FinalCta data={finalCtaData} isDark={isDark} />
      <Footer data={footerData} />
    </Box>
  )
}

export default Home
