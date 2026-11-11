import { Box, Button, Skeleton, Tab, Tabs } from '@mui/material'
import { ArrowBack as BackIcon, CollectionsOutlined as AlbumIcon, EmojiEventsOutlined as ChallengesIcon, GroupOutlined as TeamIcon, LiveTvOutlined as ScreenIcon, PeopleAltOutlined as GuestIcon, QrCode2Outlined as QrIcon, SettingsOutlined as SettingsIcon } from '@mui/icons-material'


import useEventDetailsPage, { EventDetailsPageProvider } from './hook'
import EventAlbum from './sections/eventAlbum'
import EventChallenges from './sections/eventChallenges'
import EventGuests from './sections/eventGuests'
import EventScreens from './sections/eventScreens'
import EventSettings from './sections/eventSettings'
import EventStatusControl from './sections/eventStatusControl'
import EventTeam from './sections/eventTeam'
import ShareLink from './sections/shareLink'
import { backButtonStyles, pageStyles, tabItemStyles, tabsContainerStyles, tabsStyles } from './styles'

const EventDetailsContent = () => {
  const { event, user, isLoading, activeTab, handleTabChange, handleBackToEvents } = useEventDetailsPage()

  if (isLoading || !event || !user) {
    return (
      <Box sx={pageStyles}>
        <Skeleton variant="rounded" width={140} height={36} />
        <Skeleton variant="rounded" height={44} />
        <Skeleton variant="rounded" height={280} sx={{ borderRadius: '24px' }} />
      </Box>
    )
  }

  return (
    <Box sx={pageStyles}>
      <Button
        variant="text"
        size="small"
        startIcon={<BackIcon fontSize="small" />}
        onClick={handleBackToEvents}
        sx={backButtonStyles}
      >
        Voltar para eventos
      </Button>

      <EventStatusControl />

      <Box sx={tabsContainerStyles}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
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
            value="guests"
            icon={<GuestIcon fontSize="small" />}
            iconPosition="start"
            label="Convidados"
            sx={tabItemStyles}
          />
          {event.settings.challengesEnabled && (
            <Tab
              value="challenges"
              icon={<ChallengesIcon fontSize="small" />}
              iconPosition="start"
              label="Desafios"
              sx={tabItemStyles}
            />
          )}
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
        <ShareLink />
      )}
      {activeTab === 'screens' && (
        <EventScreens />
      )}
      {activeTab === 'guests' && <EventGuests />}
      {activeTab === 'challenges' && event.settings.challengesEnabled && (
        <EventChallenges />
      )}
      {activeTab === 'album' && <EventAlbum />}
      {activeTab === 'team' && <EventTeam />}
      {activeTab === 'settings' && <EventSettings />}
    </Box>
  )
}

const EventDetails = () => (
  <EventDetailsPageProvider>
    <EventDetailsContent />
  </EventDetailsPageProvider>
)

export default EventDetails
