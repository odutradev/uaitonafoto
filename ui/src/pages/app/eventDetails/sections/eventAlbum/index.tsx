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
  CheckCircleOutline as ApproveIcon,
  Close as RejectIcon,
  CollectionsOutlined as AlbumIcon,
  DeleteOutline as DeleteIcon,
  DoneAllOutlined as DoneAllIcon,
  DownloadOutlined as DownloadIcon,
  EmojiEventsOutlined as ChallengeIcon,
  FavoriteBorder as LikeIcon
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

import { downloadEventAlbumZip } from '@actions/events'
import Modal from '@components/modal'
import Pagination from '@components/pagination'
import { getErrorMessage } from '@config/events'

import useEventAlbum, { type AlbumStatusFilter } from '../../hooks/useEventAlbum'

import {
  albumCardStyles,
  albumHeaderRowStyles,
  approveAllButtonStyles,
  approvePhotoButtonStyles,
  deletePhotoButtonStyles,
  downloadZipButtonStyles,
  guestFilterFieldStyles,
  moderationBarStyles,
  moderationFilterButtonStyles,
  moderationTabsStyles,
  photoCardStyles,
  photoImageStyles,
  photoOverlayNameStyles,
  photoOverlayStyles,
  photoStatusBadgeStyles,
  photosGridStyles,
  rejectPhotoButtonStyles,
  stateBoxStyles,
  stateIconWrapperStyles
} from './styles'
import type { EventPhoto } from '@actions/events/types'
import type { EventAlbumProps } from './types'

const downloadBlob = (blob: Blob, filename: string): void => {
  const blobUrl = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = blobUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(blobUrl)
}

const downloadPhotoFromUrl = async (url: string, filename: string): Promise<void> => {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Falha ao baixar a imagem')
    const blob = await response.blob()
    downloadBlob(blob, filename)
  } catch {
    const link = document.createElement('a')
    link.href = url
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const MODERATION_FILTERS: readonly { value: AlbumStatusFilter; label: string }[] = [
  { value: 'pending', label: 'Pendentes' },
  { value: 'approved', label: 'Aprovadas' },
  { value: 'rejected', label: 'Rejeitadas' },
  { value: 'all', label: 'Todas' }
]

const EventAlbum = ({ event }: EventAlbumProps) => {
  const isEventEnded =
    dayjs().isAfter(dayjs(event.endsAt)) ||
    Boolean(event.closedAt) ||
    event.phase === 'closed' ||
    event.phase === 'expired'

  const isModerationEnabled = Boolean(event.settings.moderationEnabled)

  const {
    photos,
    guests,
    meta,
    page,
    guestId,
    statusFilter,
    pendingCount,
    isLoading,
    setPage,
    changeGuest,
    changeStatusFilter,
    removePhoto,
    approvePhoto,
    rejectPhoto,
    approveAll
  } = useEventAlbum(event.id, isModerationEnabled)

  const [photoToDelete, setPhotoToDelete] = useState<EventPhoto | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDownloadingZip, setIsDownloadingZip] = useState(false)
  const [isApprovingAll, setIsApprovingAll] = useState(false)

  const handleConfirmRemove = async () => {
    if (!photoToDelete) return
    setIsDeleting(true)
    await removePhoto(photoToDelete.id)
    setIsDeleting(false)
    setPhotoToDelete(null)
  }

  const handleApproveAll = async () => {
    setIsApprovingAll(true)
    try {
      await approveAll()
    } finally {
      setIsApprovingAll(false)
    }
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
          <Typography variant="subtitle1" fontWeight={700} component="h2">
            Álbum do evento
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {totalPhotosCount} {totalPhotosCount === 1 ? 'foto encontrada' : 'fotos encontradas'}
            {isModerationEnabled && pendingCount > 0 && ` · ${pendingCount} aguardando aprovação`}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
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
                      <CircularProgress size={15} color="inherit" />
                    ) : (
                      <DownloadIcon sx={{ fontSize: 16 }} />
                    )
                  }
                  onClick={handleDownloadZip}
                  disabled={isDownloadingZip || totalPhotosCount === 0}
                  sx={downloadZipButtonStyles}
                >
                  {isDownloadingZip ? 'Gerando ZIP...' : 'Baixar álbum (.zip)'}
                </Button>
              </span>
            </Tooltip>
          )}
        </Box>
      </Box>

      {isModerationEnabled && (
        <Box sx={moderationBarStyles}>
          <Box sx={moderationTabsStyles}>
            {MODERATION_FILTERS.map((filter) => {
              const isActive = statusFilter === filter.value
              const label =
                filter.value === 'pending' && pendingCount > 0
                  ? `${filter.label} (${pendingCount})`
                  : filter.label

              return (
                <Button
                  key={filter.value}
                  size="small"
                  variant="text"
                  onClick={() => changeStatusFilter(filter.value)}
                  sx={moderationFilterButtonStyles(isActive)}
                >
                  {label}
                </Button>
              )
            })}
          </Box>

          {statusFilter === 'pending' && pendingCount > 0 && (
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={
                isApprovingAll ? (
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  <DoneAllIcon sx={{ fontSize: 16 }} />
                )
              }
              onClick={handleApproveAll}
              disabled={isApprovingAll}
              sx={approveAllButtonStyles}
            >
              Aprovar todas ({pendingCount})
            </Button>
          )}
        </Box>
      )}


      {isLoading && (
        <Box sx={photosGridStyles}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              sx={{ aspectRatio: '1 / 1', height: 'auto', borderRadius: '16px' }}
            />
          ))}
        </Box>
      )}

      {!isLoading && photos.length === 0 && (
        <Box sx={stateBoxStyles}>
          <Box sx={stateIconWrapperStyles}>
            {statusFilter === 'pending' ? (
              <ApproveIcon fontSize="small" color="success" />
            ) : (
              <AlbumIcon fontSize="small" />
            )}
          </Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {statusFilter === 'pending'
              ? 'Fila de aprovação zerada!'
              : 'Nenhuma foto encontrada'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {statusFilter === 'pending'
              ? 'Todas as fotos enviadas pelos convidados já foram moderadas. Novas fotos aparecerão aqui em tempo real.'
              : guestId
                ? 'Este convidado não possui fotos registradas.'
                : 'Nenhuma foto enviada ainda para este evento.'}
          </Typography>
        </Box>
      )}

      {!isLoading && photos.length > 0 && (
        <>
          <Box sx={photosGridStyles}>
            {photos.map((photo) => {
              const photoStatus = photo.status ?? 'approved'

              return (
                <Box key={photo.id} sx={photoCardStyles}>
                  {isModerationEnabled && (
                    <Box sx={photoStatusBadgeStyles(photoStatus)}>
                      {photoStatus === 'pending'
                        ? 'Pendente'
                        : photoStatus === 'approved'
                          ? 'Aprovada'
                          : 'Rejeitada'}
                    </Box>
                  )}

                  {photo.challengeTitle && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: isModerationEnabled ? 32 : 8,
                        left: 8,
                        bgcolor: 'rgba(245, 158, 11, 0.95)',
                        color: '#000',
                        px: 1,
                        py: 0.25,
                        borderRadius: '6px',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        zIndex: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        maxWidth: 'calc(100% - 16px)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                      }}
                    >
                      <ChallengeIcon sx={{ fontSize: 13 }} />
                      <Typography component="span" noWrap sx={{ fontSize: '0.68rem', fontWeight: 800 }}>
                        {photo.challengeTitle}
                      </Typography>
                    </Box>
                  )}

                  <Box
                    component="img"
                    src={photo.url}
                    alt={`Foto de ${photo.guestName}`}
                    loading="lazy"
                    sx={photoImageStyles}
                  />

                  <Box sx={photoOverlayStyles}>
                    <Typography variant="caption" sx={photoOverlayNameStyles}>
                      {photo.guestName} ·{' '}
                      <LikeIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} />{' '}
                      {photo.likesCount}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                      {photoStatus === 'pending' && (
                        <>
                          <Tooltip title="Aprovar e enviar para o telão">
                            <IconButton
                              size="small"
                              onClick={() => approvePhoto(photo.id)}
                              sx={approvePhotoButtonStyles}
                              aria-label="Aprovar foto"
                            >
                              <ApproveIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Rejeitar foto">
                            <IconButton
                              size="small"
                              onClick={() => rejectPhoto(photo.id)}
                              sx={rejectPhotoButtonStyles}
                              aria-label="Rejeitar foto"
                            >
                              <RejectIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}

                      {photoStatus === 'rejected' && (
                        <Tooltip title="Aprovar foto e enviar ao telão">
                          <IconButton
                            size="small"
                            onClick={() => approvePhoto(photo.id)}
                            sx={approvePhotoButtonStyles}
                            aria-label="Aprovar foto rejeitada"
                          >
                            <ApproveIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      )}

                      {photoStatus === 'approved' && isModerationEnabled && (
                        <Tooltip title="Rejeitar foto (retirar do telão)">
                          <IconButton
                            size="small"
                            onClick={() => rejectPhoto(photo.id)}
                            sx={deletePhotoButtonStyles}
                            aria-label="Rejeitar foto aprovada"
                          >
                            <RejectIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      )}

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

                      <Tooltip title="Remover permanentemente">
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
              )
            })}
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
            Esta foto enviada por <strong>{photoToDelete?.guestName}</strong> será excluída
            permanentemente do evento.
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
