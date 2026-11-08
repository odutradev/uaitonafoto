import { Box, Button, Chip, Skeleton, Typography } from '@mui/material'
import { ArrowBack as BackIcon, DeleteOutline as DeleteIcon } from '@mui/icons-material'
import dayjs from 'dayjs'
import { useNavigate, useParams } from 'react-router-dom'

import useAuth from '@hooks/useAuth'
import { eventPhaseLabels, eventTypeLabels } from '@config/events'
import { getEventPhase } from '@config/eventPhase'

import EventAlbum from './sections/eventAlbum'
import EventSettings from './sections/eventSettings'
import EventTeam from './sections/eventTeam'
import ShareLink from './sections/shareLink'
import useEventDetails from './hooks/useEventDetails'
import { backButtonStyles, chipsStyles, dangerButtonStyles, headerStyles, pageStyles, titleStyles } from './styles'

const EventDetails = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { event, isLoading, save, remove } = useEventDetails(id)

  if (isLoading || !event || !user) {
    return (
      <Box sx={pageStyles}>
        <Skeleton variant="rounded" height={48} />
        <Skeleton variant="rounded" height={220} />
      </Box>
    )
  }

  const handleDelete = () => {
    if (window.confirm('Excluir o evento e todas as fotos? Esta ação não pode ser desfeita.')) remove()
  }

  return (
    <Box sx={pageStyles}>
      <Button startIcon={<BackIcon />} onClick={() => navigate('/app')} sx={backButtonStyles}>
        Meus eventos
      </Button>

      <Box component="header" sx={headerStyles}>
        <Typography variant="h4" component="h1" sx={titleStyles}>
          {event.name}
        </Typography>
        <Box sx={chipsStyles}>
          <Chip size="small" label={eventTypeLabels[event.type]} />
          <Chip size="small" color="primary" variant="outlined" label={eventPhaseLabels[getEventPhase(event)]} />
          <Chip size="small" variant="outlined" label={dayjs(event.startsAt).format('DD/MM/YYYY HH:mm')} />
        </Box>
      </Box>

      <ShareLink event={event} onOpenScreen={() => navigate(`/app/events/${event.id}/screen`)} />
      <EventAlbum event={event} />
      <EventSettings event={event} onSave={save} />
      <EventTeam event={event} currentUserId={user.id} />

      {event.myRole === 'creator' && (
        <Button color="error" variant="outlined" startIcon={<DeleteIcon />} onClick={handleDelete} sx={dangerButtonStyles}>
          Excluir evento
        </Button>
      )}
    </Box>
  )
}

export default EventDetails
