import { Box, Button, Card, CardActionArea, Chip, Paper, Skeleton, Typography } from '@mui/material'
import { PhotoCameraOutlined as PhotoCameraIcon } from '@mui/icons-material'
import dayjs from 'dayjs'

import { eventPhaseLabels, eventTypeLabels } from '@config/events'
import { getEventPhase } from '@config/eventPhase'

import {
  emptyButtonStyles,
  emptyDescriptionStyles,
  emptyIconStyles,
  emptyIconWrapperStyles,
  emptyStateStyles,
  eventCardActionStyles,
  eventCardChipsStyles,
  eventCardNameStyles,
  eventCardStyles,
  eventsGridStyles
} from './styles'
import type { EventsProps } from './types'

const Events = ({ events, isLoading, onCreateEvent, onOpenEvent }: EventsProps) => {
  return (
    <Box component="section">
      {isLoading && (
        <Box sx={eventsGridStyles}>
          <Skeleton variant="rounded" height={120} />
          <Skeleton variant="rounded" height={120} />
        </Box>
      )}

      {!isLoading && events.length > 0 && (
        <Box sx={eventsGridStyles}>
          {events.map((event) => (
            <Card key={event.id} variant="outlined" sx={eventCardStyles}>
              <CardActionArea onClick={() => onOpenEvent(event.id)} sx={eventCardActionStyles}>
                <Typography variant="h6" component="h3" sx={eventCardNameStyles}>
                  {event.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dayjs(event.startsAt).format('DD/MM/YYYY [às] HH:mm')}
                </Typography>
                <Box sx={eventCardChipsStyles}>
                  <Chip size="small" label={eventTypeLabels[event.type]} />
                  <Chip size="small" color="primary" variant="outlined" label={eventPhaseLabels[getEventPhase(event)]} />
                  {event.myRole === 'organizer' && <Chip size="small" variant="outlined" label="Organizador" />}
                </Box>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}

      {!isLoading && events.length === 0 && (
        <Paper elevation={0} sx={emptyStateStyles}>
          <Box sx={emptyIconWrapperStyles}>
            <PhotoCameraIcon sx={emptyIconStyles} />
          </Box>
          <Typography variant="h6" component="h3">
            Você ainda não tem eventos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={emptyDescriptionStyles}>
            Crie seu primeiro evento, compartilhe o QR Code com os convidados e veja as fotos
            aparecerem no telão em tempo real.
          </Typography>
          <Button variant="outlined" size="large" onClick={onCreateEvent} sx={emptyButtonStyles}>
            Criar meu primeiro evento
          </Button>
        </Paper>
      )}
    </Box>
  )
}

export default Events
