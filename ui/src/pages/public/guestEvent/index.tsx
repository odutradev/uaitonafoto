import { Box, Chip, Container, Skeleton, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

import Logo from '@components/logo'
import ThemeToggle from '@components/themeToggle'
import { eventPhaseLabels, eventTypeLabels } from '@config/events'
import NotFound from '@pages/public/notFound'

import useGuestEvent from './hooks/useGuestEvent'
import GuestJoin from './sections/guestJoin'
import GuestPhotosFeed from './sections/guestPhotosFeed'
import GuestUpload from './sections/guestUpload'
import { chipsStyles, containerStyles, headerStyles, pageRootStyles, titleStyles, topBarStyles } from './styles'

const GuestEvent = () => {
  const { token = '' } = useParams()
  const {
    event,
    guest,
    photosSent,
    photosRemaining,
    photos,
    meta,
    page,
    isLoading,
    isUploading,
    notFound,
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
              <GuestJoin event={event} onJoin={join} />
            ) : (
              <>
                <GuestUpload
                  event={event}
                  guest={guest}
                  photosSent={photosSent}
                  photosRemaining={photosRemaining}
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

