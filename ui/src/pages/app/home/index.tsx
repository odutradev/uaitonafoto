import { Box, Container } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

import { getMeData } from '@actions/auth'
import useAuth from '@hooks/useAuth'
import useAuthStore from '@stores/auth'

import Events from './sections/events'
import Plans from './sections/plans'
import Welcome from './sections/welcome'
import useCheckout from './hooks/useCheckout'
import { AppHeader } from './subcomponents/appHeader'
import { homeContentStyles, homeWrapperStyles } from './styles'

const Home = () => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const { user, logout } = useAuth()
  const updateUser = useAuthStore((state) => state.updateUser)
  const { plans, isLoadingPlans, checkoutPlanId, startCheckout } = useCheckout()

  useEffect(() => {
    getMeData().then(updateUser).catch(() => undefined)
  }, [updateUser])

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
        <Plans
          plans={plans}
          isLoading={isLoadingPlans}
          checkoutPlanId={checkoutPlanId}
          freeCredits={user.freeCredits}
          paidCredits={user.paidCredits}
          onSelectPlan={startCheckout}
        />
      </Container>
    </Box>
  )
}

export default Home

