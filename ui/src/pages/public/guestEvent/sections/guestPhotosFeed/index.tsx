import { Alert, Box, Button, IconButton, Paper, Typography } from '@mui/material'
import { DeleteOutline as DeleteIcon, EmojiEventsOutlined as ChallengeIcon, Favorite as LikedIcon, FavoriteBorder as LikeIcon } from '@mui/icons-material'
import dayjs from 'dayjs'

import Pagination from '@components/pagination'

import { actionsStyles, challengeChipStyles, feedGridStyles, feedSectionStyles, guestNameStyles, photoBarStyles, photoCardStyles, photoImageStyles } from './styles'
import useGuestEventPage from '@pages/public/guestEvent/hook'

const GuestPhotosFeed = () => {
  const { event: eventValue, photos, meta, page, setPage: onPageChange, toggleLike: onToggleLike, removePhoto: onRemovePhoto } = useGuestEventPage()
  const event = eventValue!

  const isHiddenUntilEnd = event.photoVisibility === 'after_event' && dayjs().isBefore(dayjs(event.endsAt))

  const handleDelete = (photoId: string) => {
    if (window.confirm('Excluir sua foto?')) onRemovePhoto(photoId)
  }

  return (
    <Box component="section" sx={feedSectionStyles}>
      <Typography variant="h6" component="h2">
        Fotos do evento
      </Typography>

      {isHiddenUntilEnd ? (
        <Alert severity="info">
          As fotos serão reveladas após o término do evento ({dayjs(event.endsAt).format('DD/MM/YYYY [às] HH:mm')}).
        </Alert>
      ) : photos.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Nenhuma foto enviada ainda. Seja o primeiro!
        </Typography>
      ) : (
        <>
          <Box sx={feedGridStyles}>
            {photos.map((photo) => (
              <Paper key={photo.id} variant="outlined" sx={photoCardStyles}>
                {photo.challengeTitle && (
                  <Box sx={challengeChipStyles}>
                    <ChallengeIcon sx={{ fontSize: 14, flexShrink: 0, color: '#ffb74d' }} />
                    <Typography
                      component="span"
                      noWrap
                      sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffb74d', maxWidth: 160 }}
                    >
                      {photo.challengeTitle}
                    </Typography>
                  </Box>
                )}
                <Box component="img" src={photo.url} alt={`Foto de ${photo.guestName}`} loading="lazy" sx={photoImageStyles} />
                <Box sx={photoBarStyles}>
                  <Typography variant="body2" sx={guestNameStyles}>
                    {photo.guestName}
                  </Typography>
                  <Box sx={actionsStyles}>
                    <Button
                      size="small"
                      color={photo.likedByMe ? 'error' : 'inherit'}
                      startIcon={photo.likedByMe ? <LikedIcon /> : <LikeIcon />}
                      onClick={() => onToggleLike(photo.id)}
                    >
                      {photo.likesCount}
                    </Button>
                    {photo.mine && (
                      <IconButton aria-label="Excluir minha foto" size="small" onClick={() => handleDelete(photo.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>

          <Pagination
            page={page}
            totalPages={meta?.totalPages ?? 0}
            totalItems={meta?.total}
            onPageChange={onPageChange}
            hideOnSinglePage
          />
        </>
      )}
    </Box>
  )
}

export default GuestPhotosFeed

