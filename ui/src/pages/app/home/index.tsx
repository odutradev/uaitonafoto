import { Box, Container } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { toast } from 'react-toastify'

import useAuth from '@hooks/useAuth'

import Events from './sections/events'
import Welcome from './sections/welcome'
import { AppHeader } from './subcomponents/appHeader'
import { homeContentStyles, homeWrapperStyles } from './styles'

const Home = () => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { user, logout } = useAuth()

  if (!user) return null

  const firstName = user.name.split(' ')[0]

  const handleCreateEvent = () => {
    toast.info('A criação de eventos chega em breve!')
  }

  return (
    <Box sx={homeWrapperStyles}>
      <AppHeader user={user} isDark={isDark} onLogout={logout} />

      <Container component="main" maxWidth="lg" sx={homeContentStyles}>
        <Welcome firstName={firstName} onCreateEvent={handleCreateEvent} />
        <Events onCreateEvent={handleCreateEvent} />
      </Container>
    </Box>
  )
}

export default Home
