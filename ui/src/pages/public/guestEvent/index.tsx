import { Avatar, Box, Button, Chip, Container, Skeleton, Typography } from '@mui/material'
import { Chat as WhatsAppIcon } from '@mui/icons-material'
import { useParams } from 'react-router-dom'

import Logo from '@components/logo'
import ThemeToggle from '@components/themeToggle'
import { eventPhaseLabels, eventTypeLabels } from '@config/events'
import NotFound from '@pages/public/notFound'

import useGuestEvent from './hooks/useGuestEvent'
import GuestJoin from './sections/guestJoin'
import GuestPhotosFeed from './sections/guestPhotosFeed'
import GuestUpload from './sections/guestUpload'
import {
  chipsStyles,
  containerStyles,
  guestAgencyCardStyles,
  guestWhatsappButtonStyles,
  headerStyles,
  pageRootStyles,
  titleStyles,
  topBarStyles
} from './styles'

const GuestEvent = () => {
  const { token = '' } = useParams()
  const {
    event,
    guest,
    photosSent,
    completedChallengeIds,
    photos,
    meta,
    page,
    isLoading,
    isUploading,
    notFound,
    lockout,
    setPage,
    join,
    upload,
    toggleLike,
    removePhoto
  } = useGuestEvent(token)

  if (notFound) return <NotFound />

  return (
    <Box sx={pageRootStyles}>
      <Container maxWidth="sm" sx={containerStyles}>
        <Box sx={topBarStyles}>
          <Logo size="small" variant="auto" />
          <ThemeToggle />
        </Box>

        {event?.customization?.enabled && (
          <Box sx={guestAgencyCardStyles}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
              <Avatar
                src={event.customization.agencyLogoUrl}
                sx={{
                  width: 38,
                  height: 38,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  border: '1.5px solid',
                  borderColor: 'primary.main',
                  flexShrink: 0
                }}
              >
                {(event.customization.agencyName || 'A')[0].toUpperCase()}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={800} noWrap sx={{ lineHeight: 1.2 }}>
                  {event.customization.agencyName || 'Assessoria do Evento'}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ display: 'block', fontSize: '0.72rem', lineHeight: 1.1 }}
                >
                  {event.customization.agencyTagline || 'Assessoria & Cerimonial'}
                </Typography>
              </Box>
            </Box>

            {event.customization.agencyWhatsapp && (
              <Button
                component="a"
                href={`https://wa.me/${event.customization.agencyWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                  event.customization.whatsappMessage || 'Olá! Vi a marca de vocês no evento e gostaria de mais informações.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                startIcon={<WhatsAppIcon sx={{ fontSize: '15px !important' }} />}
                sx={guestWhatsappButtonStyles}
              >
                WhatsApp
              </Button>
            )}
          </Box>
        )}

        {isLoading || !event ? (
          <>
            <Skeleton variant="rounded" height={64} />
            <Skeleton variant="rounded" height={200} />
          </>
        ) : (
          <>
            <Box component="header" sx={headerStyles}>
              <Typography variant="h4" component="h1" sx={titleStyles}>
                {event.name}
              </Typography>
              <Box sx={chipsStyles}>
                <Chip size="small" label={eventTypeLabels[event.type]} />
                <Chip size="small" color="primary" variant="outlined" label={eventPhaseLabels[event.phase]} />
              </Box>
            </Box>

            {!guest ? (
              <GuestJoin event={event} onJoin={join} lockout={lockout} />
            ) : (
              <>
                <GuestUpload
                  event={event}
                  guest={guest}
                  photosSent={photosSent}
                  completedChallengeIds={completedChallengeIds}
                  isUploading={isUploading}
                  onUpload={upload}
                />
                <GuestPhotosFeed
                  event={event}
                  photos={photos}
                  meta={meta}
                  page={page}
                  onPageChange={setPage}
                  onToggleLike={toggleLike}
                  onRemovePhoto={removePhoto}
                />
              </>
            )}
          </>
        )}
      </Container>
    </Box>
  )
}

export default GuestEvent

