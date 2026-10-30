import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

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
  Hero,
  HowItWorks,
  InteractiveDemo
} from './sections'
import {
  Footer,
  Navbar
} from './subcomponents'

const LadingPage = () => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

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
      <InteractiveDemo
        liveWallData={liveWallData}
        guestFeedData={guestFeedData}
        isDark={isDark}
      />
      <FinalCta data={finalCtaData} isDark={isDark} />
      <Footer data={footerData} />
    </Box>
  )
}

export default LadingPage
