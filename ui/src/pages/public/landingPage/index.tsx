import { Box } from '@mui/material'

import useLandingPage from './hook'
import FinalCta from './sections/finalCta'
import Hero from './sections/hero'
import HowItWorks from './sections/howItWorks'
import InteractiveDemo from './sections/interactiveDemo'
import Plans from './sections/plans'
import { Footer } from './subcomponents/footer'
import { Navbar } from './subcomponents/navbar'

const LandingPage = () => {
  const {
    isDark,
    plans,
    isLoadingPlans,
    data,
    user,
    onSelectPlan
  } = useLandingPage()

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
      <Navbar data={data.header} isDark={isDark} user={user} />
      <Hero data={data.hero} isDark={isDark} />
      <HowItWorks data={data.howItWorks} isDark={isDark} />
      <InteractiveDemo
        liveWallData={data.liveWall}
        guestFeedData={data.guestFeed}
        isDark={isDark}
      />
      <Plans
        data={data.plans}
        plans={plans}
        isDark={isDark}
        isLoading={isLoadingPlans}
        onSelectPlan={onSelectPlan}
      />
      <FinalCta data={data.finalCta} isDark={isDark} />
      <Footer data={data.footer} />
    </Box>
  )
}

export default LandingPage
