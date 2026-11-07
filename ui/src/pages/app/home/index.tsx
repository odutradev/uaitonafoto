import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { getMeData } from '@actions/auth'
import useAuth from '@hooks/useAuth'
import useAuthStore from '@stores/auth'

import Events from './sections/events'
import EventsOverview from './sections/eventsOverview'
import Welcome from './sections/welcome'
import CreateEventDialog from './subcomponents/createEventDialog'
import { homeContentStyles } from './styles'

const Home = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const updateUser = useAuthStore((state) => state.updateUser)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  useEffect(() => {
    getMeData().then(updateUser).catch(() => undefined)
  }, [updateUser])

  if (!user) return null

  const firstName = user.name.split(' ')[0]

  const handleGoToBilling = () => {
    setIsCreateOpen(false)
    navigate('/app/billing')
  }

  return (
    <Box sx={homeContentStyles}>
      <Welcome firstName={firstName} onCreateEvent={() => setIsCreateOpen(true)} />

      <EventsOverview
        paidCredits={user.paidCredits}
        freeCredits={user.freeCredits}
        freeTrialClaimed={Boolean(user.freeTrialClaimedAt)}
        onGoToBilling={handleGoToBilling}
      />

      <Events onCreateEvent={() => setIsCreateOpen(true)} />

      <CreateEventDialog
        open={isCreateOpen}
        paidCredits={user.paidCredits}
        freeCredits={user.freeCredits}
        onClose={() => setIsCreateOpen(false)}
        onGoToBilling={handleGoToBilling}
      />
    </Box>
  )
}

export default Home
