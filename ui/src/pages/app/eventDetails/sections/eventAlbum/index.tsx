import { Alert, Box, MenuItem, Paper, TextField, Typography } from '@mui/material'
import { DeleteOutline as DeleteIcon, FavoriteBorder as LikeIcon } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import dayjs from 'dayjs'

import Pagination from '@components/pagination'

import useEventAlbum from '../../hooks/useEventAlbum'
import {
  albumPaperStyles,
  deletePhotoButtonStyles,
  photoCardStyles,
  photoImageStyles,
  photoOverlayNameStyles,
  photoOverlayStyles,
  photosGridStyles
} from './styles'
import type { EventAlbumProps } from './types'

const EventAlbum = ({ event }: EventAlbumProps) => {
  const isAvailable = dayjs().isAfter(dayjs(event.endsAt))
  const { photos, guests, meta, page, guestId, isLoading, setPage, changeGuest, removePhoto } = useEventAlbum(
    event.id,
    isAvailable
  )

  const handleRemove = (photoId: string) => {
    if (window.confirm('Remover esta foto do evento?')) removePhoto(photoId)
  }

  return (
    <Paper variant="outlined" sx={albumPaperStyles}>
      <Typography variant="h6" component="h2">
        Álbum do evento
      </Typography>

      {!isAvailable && (
        <Alert severity="info">
          O álbum abre após o término do evento ({dayjs(event.endsAt).format('DD/MM/YYYY [às] HH:mm')}).
        </Alert>
      )}

      {isAvailable && (
        <>
          <TextField
            select
            label="Filtrar por convidado"
            value={guestId}
            onChange={(e) => changeGuest(e.target.value)}
            fullWidth
          >
            <MenuItem value="">Todos os convidados</MenuItem>
            {guests.map((guest) => (
              <MenuItem key={guest.id} value={guest.id}>
                {guest.name} ({guest.photosCount})
              </MenuItem>
            ))}
          </TextField>

          {!isLoading && photos.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Nenhuma foto encontrada.
            </Typography>
          )}

          <Box sx={photosGridStyles}>
            {photos.map((photo) => (
              <Box key={photo.id} sx={photoCardStyles}>
                <Box component="img" src={photo.url} alt={`Foto de ${photo.guestName}`} loading="lazy" sx={photoImageStyles} />
                <Box sx={photoOverlayStyles}>
                  <Typography variant="caption" sx={photoOverlayNameStyles}>
                    {photo.guestName} · <LikeIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} /> {photo.likesCount}
                  </Typography>
                  <IconButton aria-label="Remover foto" onClick={() => handleRemove(photo.id)} sx={deletePhotoButtonStyles}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>

          <Pagination
            page={page}
            totalPages={meta?.totalPages ?? 0}
            totalItems={meta?.total}
            onPageChange={setPage}
            isLoading={isLoading}
            hideOnSinglePage
          />
        </>
      )}
    </Paper>
  )
}

export default EventAlbum
