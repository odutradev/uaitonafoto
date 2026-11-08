import { useState } from 'react'
import { Box, Button, Chip, Skeleton, Tab, Tabs, Typography } from '@mui/material'
import {
  ArrowBack as BackIcon,
  CollectionsOutlined as AlbumIcon,
  GroupOutlined as TeamIcon,
  LiveTvOutlined as ScreenIcon,
  QrCode2Outlined as QrIcon,
  SettingsOutlined as SettingsIcon
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { useNavigate, useParams } from 'react-router-dom'

import { getEventPhase } from '@config/eventPhase'
import { eventPhaseLabels, eventTypeLabels } from '@config/events'
import useAuth from '@hooks/useAuth'

import useEventDetails from './hooks/useEventDetails'
import EventAlbum from './sections/eventAlbum'
import EventScreens from './sections/eventScreens'
import EventSettings from './sections/eventSettings'
import EventTeam from './sections/eventTeam'
import ShareLink from './sections/shareLink'
import {
  backButtonStyles,
  chipsStyles,
  headerActionButtonStyles,
  headerRowStyles,
  headerTitleBlockStyles,
  pageStyles,
  tabItemStyles,
  tabsContainerStyles,
  tabsStyles,
  titleAndChipsRowStyles,
  titleStyles
} from './styles'
import type { EventDetailsTab } from './types'

const EventDetails = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { event, isLoading, save, remove, addScreen, disconnectScreen, refresh } = useEventDetails(id)
  const [activeTab, setActiveTab] = useState<EventDetailsTab>('access')

  if (isLoading || !event || !user) {
    return (
      <Box sx={pageStyles}>
        <Skeleton variant="rounded" width={140} height={36} />
        <Skeleton variant="rounded" height={72} />
        <Skeleton variant="rounded" height={44} />
        <Skeleton variant="rounded" height={280} sx={{ borderRadius: '24px' }} />
      </Box>
    )
  }

  const phase = getEventPhase(event)
  const openScreen = () => navigate(`/app/events/${event.id}/screen`)

  return (
    <Box sx={pageStyles}>
      <Button
        variant="text"
        size="small"
        startIcon={<BackIcon fontSize="small" />}
        onClick={() => navigate('/app')}
        sx={backButtonStyles}
      >
        Voltar para eventos
      </Button>

      <Box component="header" sx={headerRowStyles}>
        <Box sx={headerTitleBlockStyles}>
          <Box sx={titleAndChipsRowStyles}>
            <Typography variant="h4" component="h1" sx={titleStyles}>
              {event.name}
            </Typography>
            <Box sx={chipsStyles}>
              <Chip size="small" label={eventTypeLabels[event.type]} sx={{ fontWeight: 700 }} />
              <Chip
                size="small"
                color={phase === 'open' ? 'success' : 'primary'}
                variant={phase === 'open' ? 'filled' : 'outlined'}
                label={eventPhaseLabels[phase]}
                sx={{ fontWeight: 700 }}
              />
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary">
            {dayjs(event.startsAt).format('DD/MM/YYYY [às] HH:mm')} até{' '}
            {dayjs(event.endsAt).format('DD/MM/YYYY [às] HH:mm')}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ScreenIcon fontSize="small" />}
          onClick={openScreen}
          sx={headerActionButtonStyles}
        >
          Abrir telão
        </Button>
      </Box>

      <Box sx={tabsContainerStyles}>
        <Tabs
          value={activeTab}
          onChange={(_, nextValue: EventDetailsTab) => setActiveTab(nextValue)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="Seções de gestão do evento"
          sx={tabsStyles}
        >
          <Tab
            value="access"
            icon={<QrIcon fontSize="small" />}
            iconPosition="start"
            label="Acesso & QR Code"
            sx={tabItemStyles}
          />
          <Tab
            value="screens"
            icon={<ScreenIcon fontSize="small" />}
            iconPosition="start"
            label="Telões"
            sx={tabItemStyles}
          />
          <Tab
            value="album"
            icon={<AlbumIcon fontSize="small" />}
            iconPosition="start"
            label="Álbum de Fotos"
            sx={tabItemStyles}
          />
          <Tab
            value="team"
            icon={<TeamIcon fontSize="small" />}
            iconPosition="start"
            label="Equipe"
            sx={tabItemStyles}
          />
          <Tab
            value="settings"
            icon={<SettingsIcon fontSize="small" />}
            iconPosition="start"
            label="Configurações"
            sx={tabItemStyles}
          />
        </Tabs>
      </Box>

      {activeTab === 'access' && (
        <ShareLink
          event={event}
          onOpenScreen={openScreen}
          onSave={save}
        />
      )}
      {activeTab === 'screens' && (
        <EventScreens
          event={event}
          onOpenScreen={openScreen}
          onAddScreen={addScreen}
          onDisconnectScreen={disconnectScreen}
          onRefresh={refresh}
        />
      )}
      {activeTab === 'album' && <EventAlbum event={event} />}
      {activeTab === 'team' && <EventTeam event={event} currentUserId={user.id} />}
      {activeTab === 'settings' && <EventSettings event={event} onSave={save} onDelete={remove} />}
    </Box>
  )
}

export default EventDetails
