import { Box, Container } from '@mui/material'
import { useTheme } from '@mui/material/styles'

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
  const liveWallAccent = isDark ? brandColors.amareloFlash : brandColors.tinta
  const mosaicTiles = isDark
    ? [brandColors.darkSurface, brandColors.darkBorder, brandColors.darkPaper]
    : [brandColors.areia, brandColors.areiaDark, brandColors.bordaClara]

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Navbar data={headerData} isDark={isDark} />
      <Hero data={heroData} isDark={isDark} />
      <HowItWorks data={howItWorksData} isDark={isDark} />

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.35fr 1fr' },
            gap: 4,
            alignItems: 'center'
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
