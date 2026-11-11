import { Box } from '@mui/material'

import CreateEventDialog from './subcomponents/createEventDialog'
import useHomePage, { HomePageProvider } from './hook'
import { homeContentStyles } from './styles'
import Welcome from './sections/welcome'
import Events from './sections/events'

const HomeContent = () => {
  const { user } = useHomePage()

  if (!user) return null

  return (
    <Box sx={homeContentStyles}>
      <Welcome />
      <Events />
      <CreateEventDialog />
    </Box>
  )
}

const Home = () => (
  <HomePageProvider>
    <HomeContent />
  </HomePageProvider>
)

export default Home
