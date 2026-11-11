import { useState } from 'react'
import { Box, Button, Card, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Skeleton, Tooltip, Typography } from '@mui/material'
import { CheckCircleOutline as ApproveIcon, Close as RejectIcon, CollectionsOutlined as AlbumIcon, DeleteOutline as DeleteIcon, DoneAllOutlined as DoneAllIcon, DownloadOutlined as DownloadIcon, EmojiEventsOutlined as ChallengeIcon, FavoriteBorder as LikeIcon, FolderZipOutlined as ZipIcon, ContentCopyOutlined as CopyIcon, VisibilityOutlined as ViewIcon, PhotoCameraOutlined as CameraIcon, PeopleOutline as GuestsIcon, AccessTimeOutlined as TimeIcon } from '@mui/icons-material'
import dayjs from 'dayjs'

import { downloadEventAlbumZip } from '@actions/events'
import Modal from '@components/modal'
import Pagination from '@components/pagination'
import { buildGuestLink } from '@utils/functions/events'

import useEventAlbum, { type AlbumStatusFilter } from '@pages/app/eventDetails/hook/album'

import { albumCardStyles, albumHeaderRowStyles, approveAllButtonStyles, approvePhotoButtonStyles, deletePhotoButtonStyles, downloadZipButtonStyles, endedDownloadBigButtonStyles, endedHeroCardStyles, endedHeroIconBoxStyles, endedHeroInfoStyles, endedStatItemStyles, endedStatsRowStyles, moderationBarStyles, moderationFilterButtonStyles, moderationTabsStyles, photoCardStyles, photoDirectDownloadButtonStyles, photoImageStyles, photoOverlayNameStyles, photoOverlayStyles, photoStatusBadgeStyles, photosGridStyles, rejectPhotoButtonStyles, stateBoxStyles, stateIconWrapperStyles } from './styles'
import type { EventPhoto } from '@utils/types/events'
import useEventDetailsPage from '@pages/app/eventDetails/hook'
import useAction from '@hooks/useAction'

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

const moderationFilters: readonly { value: AlbumStatusFilter; label: string }[] = [
  { value: 'pending', label: 'Pendentes' },
  { value: 'approved', label: 'Aprovadas' },
  { value: 'rejected', label: 'Rejeitadas' },
  { value: 'all', label: 'Todas' }
]

const EventAlbum = () => {
  const runAction = useAction()
  const { event: eventValue } = useEventDetailsPage()
  const event = eventValue!

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
    statusFilter,
    pendingCount,
    isLoading,
    setPage,
    changeStatusFilter,
    removePhoto,
    approvePhoto,
    rejectPhoto,
    approveAll
  } = useEventAlbum(event.id, isModerationEnabled)

  const [photoToDelete, setPhotoToDelete] = useState<EventPhoto | null>(null)
  const [photoToView, setPhotoToView] = useState<EventPhoto | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDownloadingZip, setIsDownloadingZip] = useState(false)
  const [isApprovingAll, setIsApprovingAll] = useState(false)

  const guestLink = buildGuestLink(event.guestToken)

  const expiresAt = event.galleryExpiresAt ? dayjs(event.galleryExpiresAt) : null
  const daysLeft = expiresAt ? Math.max(0, expiresAt.diff(dayjs(), 'day')) : null

  const handleConfirmRemove = async () => {
    if (!photoToDelete) return
    setIsDeleting(true)
    await removePhoto(photoToDelete.id)
    setIsDeleting(false)
    setPhotoToDelete(null)
    if (photoToView?.id === photoToDelete.id) {
      setPhotoToView(null)
    }
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
    await runAction({
      action: async () => {
        const extension = photo.url.split('?')[0].split('.').pop() || 'jpg'
        const sanitizedEventName = event.name.replace(/[^a-zA-Z0-9_-]/g, '_')
        const sanitizedGuestName = photo.guestName.replace(/[^a-zA-Z0-9_-]/g, '_')
        const filename = `${sanitizedEventName}_${sanitizedGuestName}_${photo.id}.${extension}`
        await downloadPhotoFromUrl(photo.url, filename)
      },
      toastMessages: { success: 'Download da foto iniciado!', error: 'Não foi possível baixar a foto.' },
      shouldUseApiError: false
    })
  }

  const handleDownloadZip = async () => {
    setIsDownloadingZip(true)
    await runAction({
      action: async () => {
        const blob = await downloadEventAlbumZip(event.id)
        const sanitizedEventName = event.name.replace(/[^a-zA-Z0-9_-]/g, '_')
        const filename = `${sanitizedEventName || 'evento'}_fotos.zip`
        downloadBlob(blob, filename)
      },
      toastMessages: { success: 'Download do álbum (.zip) iniciado!', error: 'Não foi possível baixar o álbum em .zip.' }
    })
    setIsDownloadingZip(false)
  }

  const handleCopyGuestLink = async () => {
    await runAction({
      action: async () => {
        await navigator.clipboard.writeText(guestLink)
      },
      toastMessages: { success: 'Link da galeria pública copiado!', error: 'Não foi possível copiar o link.' },
      shouldUseApiError: false
    })
  }

  const totalPhotosCount = meta?.total ?? photos.length

  return (
    <Card elevation={0} sx={albumCardStyles}>
      {/* Caso 1: Evento Encerrado - Visual Focado em Download e Uso Pós-Evento */}
      {isEventEnded ? (
        <Box sx={endedHeroCardStyles}>
          <Box sx={endedHeroInfoStyles}>
            <Box sx={endedHeroIconBoxStyles}>
              <ZipIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="h6" fontWeight={800} lineHeight={1.2}>
                  Álbum Completo do Evento
                </Typography>
                <Chip
                  label="Evento Encerrado"
                  size="small"
                  color="warning"
                  sx={{ fontWeight: 700, height: 22, fontSize: '0.72rem' }}
                />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Baixe todas as fotos enviadas pelos seus convidados em alta resolução original (.zip).
              </Typography>

              <Box sx={endedStatsRowStyles}>
                <Box sx={endedStatItemStyles}>
                  <CameraIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                  <span>
                    <strong>{totalPhotosCount}</strong> {totalPhotosCount === 1 ? 'foto' : 'fotos'}
                  </span>
                </Box>

                {guests.length > 0 && (
                  <Box sx={endedStatItemStyles}>
                    <GuestsIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <span>
                      <strong>{guests.length}</strong> {guests.length === 1 ? 'convidado' : 'convidados'}
                    </span>
                  </Box>
                )}

                {expiresAt && (
                  <Box sx={endedStatItemStyles}>
                    <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <span>
                      {daysLeft !== null && daysLeft > 0
                        ? `Restam ${daysLeft} dias para download`
                        : `Disponível até ${expiresAt.format('DD/MM/YYYY')}`}
                    </span>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              startIcon={<CopyIcon sx={{ fontSize: 16 }} />}
              onClick={handleCopyGuestLink}
              sx={{ minHeight: 42, px: 2, borderRadius: '10px', fontWeight: 600 }}
            >
              Copiar link da galeria
            </Button>

            <Tooltip
              title={
                totalPhotosCount === 0
                  ? 'Nenhuma foto enviada para baixar'
                  : 'Baixar todas as fotos originais compactadas em um único arquivo .zip'
              }
            >
              <span>
                <Button
                  variant="contained"
                  size="medium"
                  startIcon={
                    isDownloadingZip ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <DownloadIcon sx={{ fontSize: 18 }} />
                    )
                  }
                  onClick={handleDownloadZip}
                  disabled={isDownloadingZip || totalPhotosCount === 0}
                  sx={endedDownloadBigButtonStyles}
                >
                  {isDownloadingZip ? 'Preparando arquivo ZIP...' : 'Baixar Álbum Completo (.zip)'}
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Box>
      ) : (
        /* Caso 2: Evento em Andamento - Header Limpo sem o filtro por convidado */
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

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Copiar link da página de envio para convidados">
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<CopyIcon sx={{ fontSize: 16 }} />}
                onClick={handleCopyGuestLink}
                sx={downloadZipButtonStyles}
              >
                Copiar link
              </Button>
            </Tooltip>
          </Box>
        </Box>
      )}

      {/* Barra de Moderação: Ativa somente quando o evento está em andamento com moderação ligada */}
      {isModerationEnabled && !isEventEnded && (
        <Box sx={moderationBarStyles}>
          <Box sx={moderationTabsStyles}>
            {moderationFilters.map((filter) => {
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

      {/* Estado Carregando */}
      {isLoading && (
        <Box sx={photosGridStyles}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              sx={{ aspectRatio: '1 / 1', height: 'auto', borderRadius: '14px' }}
            />
          ))}
        </Box>
      )}

      {/* Estado Vazio */}
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
              : isEventEnded
                ? 'Nenhuma foto foi registrada durante o evento.'
                : 'Nenhuma foto enviada ainda para este evento.'}
          </Typography>
        </Box>
      )}

      {/* Grid de Fotos */}
      {!isLoading && photos.length > 0 && (
        <>
          <Box sx={photosGridStyles}>
            {photos.map((photo) => {
              const photoStatus = photo.status ?? 'approved'

              return (
                <Box
                  key={photo.id}
                  sx={photoCardStyles}
                  onClick={() => setPhotoToView(photo)}
                >
                  {/* Badge de Moderação (exibido apenas se moderação ativa e evento ainda aberto) */}
                  {isModerationEnabled && !isEventEnded && (
                    <Box sx={photoStatusBadgeStyles(photoStatus)}>
                      {photoStatus === 'pending'
                        ? 'Pendente'
                        : photoStatus === 'approved'
                          ? 'Aprovada'
                          : 'Rejeitada'}
                    </Box>
                  )}

                  {/* Tag do Desafio Cumprido */}
                  {photo.challengeTitle && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: isModerationEnabled && !isEventEnded ? 32 : 8,
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

                  {/* Overlay com Informações e Ações */}
                  <Box
                    sx={photoOverlayStyles}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Typography variant="caption" sx={photoOverlayNameStyles}>
                      {photo.guestName} ·{' '}
                      <LikeIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} />{' '}
                      {photo.likesCount}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                      {/* Ações quando o evento está encerrado: Download com 1 clique, Zoom e Excluir */}
                      {isEventEnded ? (
                        <>
                          <Tooltip title="Baixar esta foto em alta resolução">
                            <IconButton
                              aria-label="Baixar foto"
                              size="small"
                              onClick={() => handleDownloadPhoto(photo)}
                              sx={photoDirectDownloadButtonStyles}
                            >
                              <DownloadIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Visualizar ampliada">
                            <IconButton
                              aria-label="Ver foto"
                              size="small"
                              onClick={() => setPhotoToView(photo)}
                              sx={deletePhotoButtonStyles}
                            >
                              <ViewIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Remover do álbum">
                            <IconButton
                              aria-label="Remover foto"
                              size="small"
                              onClick={() => setPhotoToDelete(photo)}
                              sx={deletePhotoButtonStyles}
                            >
                              <DeleteIcon sx={{ fontSize: 15 }} />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        /* Ações durante o evento em andamento: Moderação e Download */
                        <>
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
                        </>
                      )}
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

      {/* Modal Lightbox: Visualização de Foto Ampliada */}
      <Dialog
        open={Boolean(photoToView)}
        onClose={() => setPhotoToView(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: 'background.paper',
            overflow: 'hidden'
          }
        }}
      >
        {photoToView && (
          <>
            <DialogTitle
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
                  Foto de {photoToView.guestName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {dayjs(photoToView.createdAt).format('DD/MM/YYYY [às] HH:mm')} ·{' '}
                  {photoToView.likesCount} {photoToView.likesCount === 1 ? 'curtida' : 'curtidas'}
                  {photoToView.challengeTitle && ` · Missão: ${photoToView.challengeTitle}`}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
                  onClick={() => handleDownloadPhoto(photoToView)}
                  sx={{ borderRadius: '8px', fontWeight: 700 }}
                >
                  Baixar foto
                </Button>
                <IconButton onClick={() => setPhotoToView(null)} size="small" aria-label="Fechar">
                  <RejectIcon fontSize="small" />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent
              sx={{
                p: 2,
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0D0B08' : '#F5F5F3'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 380
              }}
            >
              <Box
                component="img"
                src={photoToView.url}
                alt={`Foto de ${photoToView.guestName}`}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '75vh',
                  objectFit: 'contain',
                  borderRadius: 2,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
                }}
              />
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
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
