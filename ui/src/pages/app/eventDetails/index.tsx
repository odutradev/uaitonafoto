import { Box, Button, Skeleton, Tab, Tabs } from '@mui/material'
import {
  ArrowBack as BackIcon,
  CollectionsOutlined as AlbumIcon,
  EmojiEventsOutlined as ChallengesIcon,
  GroupOutlined as TeamIcon,
  LiveTvOutlined as ScreenIcon,
  QrCode2Outlined as QrIcon,
  SettingsOutlined as SettingsIcon
} from '@mui/icons-material'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import useAuth from '@hooks/useAuth'

import useEventDetails from './hooks/useEventDetails'
import EventAlbum from './sections/eventAlbum'
import EventChallenges from './sections/eventChallenges'
import EventScreens from './sections/eventScreens'
import EventSettings from './sections/eventSettings'
import EventStatusControl from './sections/eventStatusControl'
import EventTeam from './sections/eventTeam'
import ShareLink from './sections/shareLink'
import {
  backButtonStyles,
  pageStyles,
  tabItemStyles,
  tabsContainerStyles,
  tabsStyles
} from './styles'
import type { EventDetailsTab } from './types'

const VALID_TABS: readonly EventDetailsTab[] = ['access', 'screens', 'challenges', 'album', 'team', 'settings']

const isValidTab = (tab: string | null): tab is EventDetailsTab => {
  return tab !== null && (VALID_TABS as readonly string[]).includes(tab)
}

const EventDetails = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const {
    event,
    isLoading,
    save,
    remove,
    addScreen,
    disconnectScreen,
    updateScreen,
    toggleBlockScreen,
    refresh,
    start,
    close,
    reopen,
    unlockPin
  } = useEventDetails(id)

  const rawTab = searchParams.get('tab')
  const activeTab: EventDetailsTab = isValidTab(rawTab) ? rawTab : 'access'

  const handleTabChange = (_: unknown, nextTab: EventDetailsTab) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (nextTab === 'access') {
          next.delete('tab')
        } else {
          next.set('tab', nextTab)
        }
        return next
      },
      { replace: true }
    )
  }

  if (isLoading || !event || !user) {
    return (
      <Box sx={pageStyles}>
        <Skeleton variant="rounded" width={140} height={36} />
        <Skeleton variant="rounded" height={44} />
        <Skeleton variant="rounded" height={280} sx={{ borderRadius: '24px' }} />
      </Box>
    )
  }

  const openScreen = () => navigate(`/e/${event.guestToken}/screen`)

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

      <EventStatusControl
        event={event}
        onStart={start}
        onClose={close}
        onReopen={reopen}
      />

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
        <ShareLink
          event={event}
          onUnlockLockouts={() => unlockPin('guest')}
        />
      )}
      {activeTab === 'screens' && (
        <EventScreens
          event={event}
          onOpenScreen={openScreen}
          onAddScreen={addScreen}
          onDisconnectScreen={disconnectScreen}
          onUpdateScreen={updateScreen}
          onToggleBlockScreen={toggleBlockScreen}
          onRefresh={refresh}
          onUnlockLockouts={() => unlockPin('screen')}
        />
      )}
      {activeTab === 'challenges' && event.settings.challengesEnabled && (
        <EventChallenges event={event} onRefresh={refresh} />
      )}
      {activeTab === 'album' && <EventAlbum event={event} />}
      {activeTab === 'team' && <EventTeam event={event} currentUserId={user.id} />}
      {activeTab === 'settings' && <EventSettings event={event} onSave={save} onDelete={remove} />}
    </Box>
  )
}

export default EventDetails
