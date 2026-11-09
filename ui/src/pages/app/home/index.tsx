import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { getMeData } from '@actions/auth'
import useAuth from '@hooks/useAuth'
import useAuthStore from '@stores/auth'

import Events from './sections/events'
import Welcome from './sections/welcome'
import CreateEventDialog from './subcomponents/createEventDialog'
import useEvents from './hooks/useEvents'
import { homeContentStyles } from './styles'

const Home = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const updateUser = useAuthStore((state) => state.updateUser)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const { events, isLoading } = useEvents()

  useEffect(() => {
    getMeData().then(updateUser).catch(() => undefined)
  }, [updateUser])

  if (!user) return null

  const firstName = user.name.split(' ')[0]

  return (
    <Box sx={homeContentStyles}>
      <Welcome firstName={firstName} onCreateEvent={() => setIsCreateOpen(true)} />

      <Events
        events={events}
        isLoading={isLoading}
        onCreateEvent={() => setIsCreateOpen(true)}
        onOpenEvent={(eventId) => navigate(`/app/events/${eventId}`)}
      />

      <CreateEventDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={(event) => navigate(`/app/events/${event.id}`)}
      />
    </Box>
  )
}

export default Home
