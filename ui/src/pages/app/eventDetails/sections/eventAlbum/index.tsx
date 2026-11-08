import { useState } from 'react'
import { Box, Card, IconButton, MenuItem, Skeleton, TextField, Typography } from '@mui/material'
import {
  CollectionsOutlined as AlbumIcon,
  DeleteOutline as DeleteIcon,
  FavoriteBorder as LikeIcon,
  LockClockOutlined as LockClockIcon
} from '@mui/icons-material'
import dayjs from 'dayjs'

import Modal from '@components/modal'
import Pagination from '@components/pagination'

import useEventAlbum from '../../hooks/useEventAlbum'
import {
  albumCardStyles,
  albumHeaderRowStyles,
  deletePhotoButtonStyles,
  guestFilterFieldStyles,
  photoCardStyles,
  photoImageStyles,
  photoOverlayNameStyles,
  photoOverlayStyles,
  photosGridStyles,
  stateBoxStyles,
  stateIconWrapperStyles
} from './styles'
import type { EventPhoto } from '@actions/events/types'
import type { EventAlbumProps } from './types'

const EventAlbum = ({ event }: EventAlbumProps) => {
  const isAvailable = dayjs().isAfter(dayjs(event.endsAt))
  const { photos, guests, meta, page, guestId, isLoading, setPage, changeGuest, removePhoto } = useEventAlbum(
    event.id,
    isAvailable
  )
  const [photoToDelete, setPhotoToDelete] = useState<EventPhoto | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmRemove = async () => {
    if (!photoToDelete) return
    setIsDeleting(true)
    await removePhoto(photoToDelete.id)
    setIsDeleting(false)
    setPhotoToDelete(null)
  }

  return (
    <Card elevation={0} sx={albumCardStyles}>
      <Box sx={albumHeaderRowStyles}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" component="h2">
            Álbum do evento
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {isAvailable
              ? `${meta?.total ?? photos.length} ${(meta?.total ?? photos.length) === 1 ? 'foto enviada' : 'fotos enviadas'} pelos convidados.`
              : 'Visualize e modere os registros completos após o encerramento.'}
          </Typography>
        </Box>

        {isAvailable && guests.length > 0 && (
          <TextField
            select
            size="small"
            label="Filtrar por convidado"
            value={guestId}
            onChange={(e) => changeGuest(e.target.value)}
            sx={guestFilterFieldStyles}
          >
            <MenuItem value="">Todos os convidados</MenuItem>
            {guests.map((guest) => (
              <MenuItem key={guest.id} value={guest.id}>
                {guest.name} ({guest.photosCount})
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>

      {!isAvailable && (
        <Box sx={stateBoxStyles}>
          <Box sx={stateIconWrapperStyles}>
            <LockClockIcon fontSize="small" />
          </Box>
          <Typography variant="subtitle1" fontWeight={700}>
            Álbum aguarda o término do evento
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
            A galeria consolidada será liberada em{' '}
            <strong>{dayjs(event.endsAt).format('DD/MM/YYYY [às] HH:mm')}</strong>. Enquanto isso, acompanhe os envios pelo telão ao vivo.
          </Typography>
        </Box>
      )}

      {isAvailable && isLoading && (
        <Box sx={photosGridStyles}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" sx={{ aspectRatio: '1 / 1', height: 'auto', borderRadius: '16px' }} />
          ))}
        </Box>
      )}

      {isAvailable && !isLoading && photos.length === 0 && (
        <Box sx={stateBoxStyles}>
          <Box sx={stateIconWrapperStyles}>
            <AlbumIcon fontSize="small" />
          </Box>
          <Typography variant="subtitle1" fontWeight={700}>
            Nenhuma foto encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {guestId ? 'Este convidado não possui fotos registradas.' : 'Nenhuma foto foi enviada durante o evento.'}
          </Typography>
        </Box>
      )}

      {isAvailable && !isLoading && photos.length > 0 && (
        <>
          <Box sx={photosGridStyles}>
            {photos.map((photo) => (
              <Box key={photo.id} sx={photoCardStyles}>
                <Box
                  component="img"
                  src={photo.url}
                  alt={`Foto de ${photo.guestName}`}
                  loading="lazy"
                  sx={photoImageStyles}
                />
                <Box sx={photoOverlayStyles}>
                  <Typography variant="caption" sx={photoOverlayNameStyles}>
                    {photo.guestName} · <LikeIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} /> {photo.likesCount}
                  </Typography>
                  <IconButton
                    aria-label="Remover foto"
                    size="small"
                    onClick={() => setPhotoToDelete(photo)}
                    sx={deletePhotoButtonStyles}
                  >
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

      <Modal
        open={Boolean(photoToDelete)}
        onClose={() => setPhotoToDelete(null)}
        variant="danger"
        title="Remover foto do álbum?"
        description={
          <>
            Esta foto enviada por <strong>{photoToDelete?.guestName}</strong> será excluída permanentemente do evento.
          </>
        }
        primaryAction={{
          label: isDeleting ? 'Removendo...' : 'Remover foto',
          onClick: handleConfirmRemove,
          loading: isDeleting,
          color: 'error'
        }}
        secondaryAction={{
          label: 'Cancelar',
          onClick: () => setPhotoToDelete(null),
          disabled: isDeleting
        }}
      />
    </Card>
  )
}

export default EventAlbum
