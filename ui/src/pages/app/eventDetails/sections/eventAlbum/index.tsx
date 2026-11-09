import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  MenuItem,
  Skeleton,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import {
  CollectionsOutlined as AlbumIcon,
  DeleteOutline as DeleteIcon,
  DownloadOutlined as DownloadIcon,
  FavoriteBorder as LikeIcon
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

import { downloadEventAlbumZip } from '@actions/events'
import Modal from '@components/modal'
import Pagination from '@components/pagination'
import { getErrorMessage } from '@config/events'
import { downloadBlob, downloadPhotoFromUrl } from '@/utils/download'

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
  const isEventEnded =
    dayjs().isAfter(dayjs(event.endsAt)) ||
    Boolean(event.closedAt) ||
    event.phase === 'closed' ||
    event.phase === 'expired'

  const { photos, guests, meta, page, guestId, isLoading, setPage, changeGuest, removePhoto } = useEventAlbum(
    event.id
  )
  const [photoToDelete, setPhotoToDelete] = useState<EventPhoto | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDownloadingZip, setIsDownloadingZip] = useState(false)

  const handleConfirmRemove = async () => {
    if (!photoToDelete) return
    setIsDeleting(true)
    await removePhoto(photoToDelete.id)
    setIsDeleting(false)
    setPhotoToDelete(null)
  }

  const handleDownloadPhoto = async (photo: EventPhoto) => {
    try {
      const extension = photo.url.split('?')[0].split('.').pop() || 'jpg'
      const sanitizedEventName = event.name.replace(/[^a-zA-Z0-9_-]/g, '_')
      const sanitizedGuestName = photo.guestName.replace(/[^a-zA-Z0-9_-]/g, '_')
      const filename = `${sanitizedEventName}_${sanitizedGuestName}_${photo.id}.${extension}`
      await downloadPhotoFromUrl(photo.url, filename)
      toast.success('Download da foto iniciado!')
    } catch {
      toast.error('Não foi possível baixar a foto.')
    }
  }

  const handleDownloadZip = async () => {
    setIsDownloadingZip(true)
    try {
      const blob = await downloadEventAlbumZip(event.id)
      const sanitizedEventName = event.name.replace(/[^a-zA-Z0-9_-]/g, '_')
      const filename = `${sanitizedEventName || 'evento'}_fotos.zip`
      downloadBlob(blob, filename)
      toast.success('Download do álbum (.zip) iniciado!')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível baixar o álbum em .zip.'))
    } finally {
      setIsDownloadingZip(false)
    }
  }

  const totalPhotosCount = meta?.total ?? photos.length

  return (
    <Card elevation={0} sx={albumCardStyles}>
      <Box sx={albumHeaderRowStyles}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" component="h2">
            Álbum do evento
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {totalPhotosCount} {totalPhotosCount === 1 ? 'foto enviada' : 'fotos enviadas'} pelos convidados.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          {isEventEnded && (
            <Tooltip
              title={
                totalPhotosCount === 0
                  ? 'Nenhuma foto enviada para baixar'
                  : 'Baixar todas as fotos do evento compactadas em um único arquivo .zip'
              }
            >
              <span>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={
                    isDownloadingZip ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <DownloadIcon fontSize="small" />
                    )
                  }
                  onClick={handleDownloadZip}
                  disabled={isDownloadingZip || totalPhotosCount === 0}
                  sx={{ whiteSpace: 'nowrap', fontWeight: 700, borderRadius: '9999px', px: 2 }}
                >
                  {isDownloadingZip ? 'Gerando ZIP...' : 'Baixar álbum (.zip)'}
                </Button>
              </span>
            </Tooltip>
          )}

          {guests.length > 0 && (
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
      </Box>

      {isLoading && (
        <Box sx={photosGridStyles}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" sx={{ aspectRatio: '1 / 1', height: 'auto', borderRadius: '16px' }} />
          ))}
        </Box>
      )}

      {!isLoading && photos.length === 0 && (
        <Box sx={stateBoxStyles}>
          <Box sx={stateIconWrapperStyles}>
            <AlbumIcon fontSize="small" />
          </Box>
          <Typography variant="subtitle1" fontWeight={700}>
            Nenhuma foto encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {guestId ? 'Este convidado não possui fotos registradas.' : 'Nenhuma foto foi enviada ainda para este evento.'}
          </Typography>
        </Box>
      )}

      {!isLoading && photos.length > 0 && (
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

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0 }}>
                    {isEventEnded && (
                      <Tooltip title="Baixar foto">
                        <IconButton
                          aria-label="Baixar foto"
                          size="small"
                          onClick={() => handleDownloadPhoto(photo)}
                          sx={deletePhotoButtonStyles}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="Remover foto">
                      <IconButton
                        aria-label="Remover foto"
                        size="small"
                        onClick={() => setPhotoToDelete(photo)}
                        sx={deletePhotoButtonStyles}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
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
