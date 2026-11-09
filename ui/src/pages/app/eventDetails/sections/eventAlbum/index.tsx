import { useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Card,
  Chip,
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
  FavoriteBorder as LikeIcon,
  HourglassEmptyOutlined as PendingIcon,
  VerifiedOutlined as ApprovedIcon,
  BlockOutlined as RejectedIcon
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

import { downloadEventAlbumZip } from '@actions/events'
import Modal from '@components/modal'
import Pagination from '@components/pagination'
import { getErrorMessage } from '@config/events'
import { downloadBlob, downloadPhotoFromUrl } from '@/utils/download'

import useEventAlbum, { type AlbumStatusFilter } from '../../hooks/useEventAlbum'
import {
  albumCardStyles,
  albumHeaderRowStyles,
  approvePhotoButtonStyles,
  deletePhotoButtonStyles,
  guestFilterFieldStyles,
  moderationBarStyles,
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
      {/* Header */}
      <Box sx={albumHeaderRowStyles}>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" component="h2">
              Álbum do evento
            </Typography>
            {isModerationEnabled && (
              <Chip
                size="small"
                color="warning"
                variant="outlined"
                label="Moderação prévia ativa"
                sx={{ fontWeight: 700, fontSize: '0.72rem' }}
              />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {totalPhotosCount} {totalPhotosCount === 1 ? 'foto encontrada' : 'fotos encontradas'}
            {isModerationEnabled && pendingCount > 0 && ` • ${pendingCount} aguardando aprovação`}
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

      {/* Moderation Controls Bar (when enabled) */}
      {isModerationEnabled && (
        <Box sx={moderationBarStyles}>
          <Box sx={moderationTabsStyles}>
            <Badge badgeContent={pendingCount} color="error">
              <Chip
                icon={<PendingIcon fontSize="small" />}
                label="Fila de Aprovação"
                color={statusFilter === 'pending' ? 'primary' : 'default'}
                variant={statusFilter === 'pending' ? 'filled' : 'outlined'}
                onClick={() => changeStatusFilter('pending')}
                clickable
                sx={{ fontWeight: 700 }}
              />
            </Badge>

            <Chip
              icon={<ApprovedIcon fontSize="small" />}
              label="Aprovadas no Telão"
              color={statusFilter === 'approved' ? 'success' : 'default'}
              variant={statusFilter === 'approved' ? 'filled' : 'outlined'}
              onClick={() => changeStatusFilter('approved')}
              clickable
              sx={{ fontWeight: 600 }}
            />

            <Chip
              icon={<AlbumIcon fontSize="small" />}
              label="Todas as Fotos"
              color={statusFilter === 'all' ? 'primary' : 'default'}
              variant={statusFilter === 'all' ? 'filled' : 'outlined'}
              onClick={() => changeStatusFilter('all')}
              clickable
              sx={{ fontWeight: 600 }}
            />

            <Chip
              icon={<RejectedIcon fontSize="small" />}
              label="Rejeitadas"
              color={statusFilter === 'rejected' ? 'error' : 'default'}
              variant={statusFilter === 'rejected' ? 'filled' : 'outlined'}
              onClick={() => changeStatusFilter('rejected')}
              clickable
              sx={{ fontWeight: 600 }}
            />
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
                  <DoneAllIcon fontSize="small" />
                )
              }
              onClick={handleApproveAll}
              disabled={isApprovingAll}
              sx={{ fontWeight: 700, borderRadius: '999px', px: 2 }}
            >
              Aprovar todas ({pendingCount})
            </Button>
          )}
        </Box>
      )}

      {/* Loading state */}
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

      {/* Empty State */}
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

      {/* Photos Grid */}
      {!isLoading && photos.length > 0 && (
        <>
          <Box sx={photosGridStyles}>
            {photos.map((photo) => {
              const photoStatus = photo.status ?? 'approved'

              return (
                <Box key={photo.id} sx={photoCardStyles}>
                  {/* Status Badge when moderation is active */}
                  {isModerationEnabled && (
                    <Box sx={photoStatusBadgeStyles(photoStatus)}>
                      {photoStatus === 'pending'
                        ? 'Pendente'
                        : photoStatus === 'approved'
                          ? 'Aprovada'
                          : 'Rejeitada'}
                    </Box>
                  )}

                  <Box
                    component="img"
                    src={photo.url}
                    alt={`Foto de ${photo.guestName}`}
                    loading="lazy"
                    sx={photoImageStyles}
                  />

                  {/* Actions overlay */}
                  <Box sx={photoOverlayStyles}>
                    <Typography variant="caption" sx={photoOverlayNameStyles}>
                      {photo.guestName} ·{' '}
                      <LikeIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} />{' '}
                      {photo.likesCount}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                      {/* One-touch moderation buttons */}
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

      {/* Delete Confirmation Modal */}
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
