import { useMemo, useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Typography
} from '@mui/material'
import {
  AddAPhotoOutlined as CameraIcon,
  CasinoOutlined as DiceIcon,
  CheckCircleRounded as CheckIcon,
  Close as CloseIcon,
  EmojiEventsOutlined as ChallengeIcon,
  Replay as RepeatIcon,
  ScreenRotationOutlined as ScreenRotationIcon,
  ShuffleOutlined as ShuffleIcon
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

import {
  challengeActiveBadgeStyles,
  challengeButtonStyles,
  challengeCompletedItemCardStyles,
  challengeItemCardStyles,
  randomChallengeCardStyles,
  uploadButtonStyles,
  uploadButtonsRowStyles,
  uploadHeaderStyles,
  uploadPaperStyles
} from './styles'
import type { ChangeEvent } from 'react'
import type { EventChallenge } from '@actions/events/types'
import type { GuestUploadProps } from './types'

const MAX_PHOTO_AGE_MS = 5 * 60 * 1000

const GuestUpload = ({
  event,
  guest,
  photosSent,
  completedChallengeIds = [],
  isUploading,
  onUpload
}: GuestUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState<EventChallenge | null>(null)
  const [randomChallenge, setRandomChallenge] = useState<EventChallenge | null>(null)

  const canUpload = event.phase === 'open'
  const hasChallenges = Boolean(event.challengesEnabled && (event.challenges?.length ?? 0) > 0)
  const isRandomMode = event.challengesMode === 'random'

  const completedIds = useMemo(() => completedChallengeIds ?? [], [completedChallengeIds])
  const isCompleted = (id: string) => completedIds.includes(id)

  const activeChallenges = useMemo(
    () => (event.challenges ?? []).filter((c) => c.active !== false),
    [event.challenges]
  )
  const completedChallenges = useMemo(
    () => activeChallenges.filter((c) => isCompleted(c.id)),
    [activeChallenges, completedIds]
  )
  const pendingChallenges = useMemo(
    () => activeChallenges.filter((c) => !isCompleted(c.id)),
    [activeChallenges, completedIds]
  )

  const pickRandom = (excludeId?: string) => {
    const candidates = pendingChallenges.length > 0 ? pendingChallenges : activeChallenges
    if (candidates.length === 0) return null

    const pool = candidates.length > 1 && excludeId
      ? candidates.filter((c) => c.id !== excludeId)
      : candidates

    const chosen = pool[Math.floor(Math.random() * pool.length)] || candidates[0]
    setRandomChallenge(chosen)
    return chosen
  }

  const handleOpenChallengeModal = () => {
    if (isRandomMode) {
      if (!randomChallenge || !activeChallenges.some((c) => c.id === randomChallenge.id)) {
        pickRandom()
      }
    }
    setIsChallengeModalOpen(true)
  }

  const handleNormalPhotoClick = () => {
    setSelectedChallenge(null)
    toast.info('Dica: Tire a foto com o celular deitado (horizontal) para enquadrar perfeitamente no telão!', { autoClose: 3500 })
    inputRef.current?.click()
  }

  const handleSelectChallenge = (challenge: EventChallenge) => {
    setSelectedChallenge(challenge)
    setIsChallengeModalOpen(false)
    toast.info('Dica: Tire a foto com o celular deitado (horizontal) para enquadrar perfeitamente no telão!', { autoClose: 3500 })
    setTimeout(() => {
      inputRef.current?.click()
    }, 150)
  }

  const handleCancelSelectedChallenge = () => {
    setSelectedChallenge(null)
  }

  const handleFileChange = async (changeEvent: ChangeEvent<HTMLInputElement>) => {
    const file = changeEvent.target.files?.[0]
    changeEvent.target.value = ''
    if (!file) return

    if (file.lastModified) {
      const fileAgeMs = Date.now() - file.lastModified
      if (fileAgeMs > MAX_PHOTO_AGE_MS || fileAgeMs < -60000) {
        toast.error('Apenas fotos tiradas na hora com a câmera são permitidas. Não é possível selecionar fotos antigas da galeria.')
        return
      }
    }

    const currentChallenge = selectedChallenge
    try {
      await onUpload(file, currentChallenge?.id, currentChallenge?.title)
    } finally {
      setSelectedChallenge(null)
    }
  }

  return (
    <>
      <Paper variant="outlined" sx={uploadPaperStyles}>
        <Box sx={uploadHeaderStyles}>
          <Typography variant="subtitle1" fontWeight={700}>
            Olá, {guest.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            {photosSent > 0 && (
              <Chip
                size="small"
                color="primary"
                label={`${photosSent} ${photosSent === 1 ? 'foto enviada' : 'fotos enviadas'}`}
              />
            )}
            {hasChallenges && completedChallenges.length > 0 && (
              <Chip
                size="small"
                color="success"
                icon={<ChallengeIcon sx={{ fontSize: '15px !important', color: 'inherit !important' }} />}
                label={`${completedChallenges.length} ${completedChallenges.length === 1 ? 'missão cumprida' : 'missões cumpridas'}`}
              />
            )}
          </Box>
        </Box>

        {event.phase === 'upcoming' && (
          <Alert severity="info">
            O envio de fotos começa em {dayjs(event.startsAt).format('DD/MM/YYYY [às] HH:mm')}.
          </Alert>
        )}

        {event.phase === 'closed' && <Alert severity="info">O período de envio de fotos já se encerrou.</Alert>}

        {selectedChallenge && (
          <Box sx={challengeActiveBadgeStyles}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flexWrap: 'wrap' }}>
              <ChallengeIcon sx={{ fontSize: 20, flexShrink: 0 }} />
              <Typography variant="body2" noWrap>
                Missão ativa: <strong>{selectedChallenge.title}</strong>
              </Typography>
              {isCompleted(selectedChallenge.id) && (
                <Chip size="small" color="success" label="Já cumprida" sx={{ height: 20, fontSize: '0.65rem' }} />
              )}
            </Box>
            <IconButton
              size="small"
              onClick={handleCancelSelectedChallenge}
              aria-label="Cancelar missão"
              sx={{ p: 0.5, color: 'inherit' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {canUpload && (
          <Box
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              borderRadius: '16px',
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 207, 31, 0.08)' : 'rgba(255, 207, 31, 0.15)',
              border: '1px solid',
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 207, 31, 0.3)' : 'rgba(255, 207, 31, 0.5)',
              textAlign: 'left'
            })}
          >
            <ScreenRotationIcon sx={{ fontSize: 24, color: '#f59e0b', flexShrink: 0 }} />
            <Box>
              <Typography variant="caption" fontWeight={800} sx={{ display: 'block', color: 'text.primary', lineHeight: 1.25 }}>
                Dica para brilhar no telão:
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.3 }}>
                Tire a foto com o <strong>celular deitado (horizontal)</strong> para preencher o telão da festa sem cortes! Fotos em pé (verticais) serão ajustadas no centro.
              </Typography>
            </Box>
          </Box>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={handleFileChange}
        />

        {hasChallenges && activeChallenges.length > 0 ? (
          <Box sx={uploadButtonsRowStyles}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<CameraIcon />}
              disabled={!canUpload || isUploading}
              onClick={handleNormalPhotoClick}
              sx={uploadButtonStyles}
            >
              {isUploading && !selectedChallenge ? 'Enviando foto...' : 'Tirar foto normal'}
            </Button>

            <Button
              variant="contained"
              size="large"
              startIcon={isRandomMode ? <DiceIcon /> : <ChallengeIcon />}
              disabled={!canUpload || isUploading}
              onClick={handleOpenChallengeModal}
              sx={challengeButtonStyles}
            >
              {isUploading && selectedChallenge
                ? 'Enviando missão...'
                : isRandomMode
                  ? 'Sortear uma missão'
                  : 'Cumprir um desafio'}
            </Button>
          </Box>
        ) : (
          <Button
            variant="contained"
            size="large"
            startIcon={<CameraIcon />}
            disabled={!canUpload || isUploading}
            onClick={handleNormalPhotoClick}
            sx={uploadButtonStyles}
          >
            {isUploading ? 'Enviando foto...' : 'Tirar foto'}
          </Button>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
          Abre a câmera na hora • Fotos antigas da galeria não são permitidas
        </Typography>
      </Paper>

      <Dialog
        open={isChallengeModalOpen}
        onClose={() => setIsChallengeModalOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              p: 1
            }
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isRandomMode ? (
              <DiceIcon sx={{ color: '#f59e0b' }} />
            ) : (
              <ChallengeIcon sx={{ color: '#f59e0b' }} />
            )}
            <Typography variant="h6" fontWeight={800}>
              {isRandomMode ? 'Missão Sorteada' : 'Escolha uma Missão'}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => setIsChallengeModalOpen(false)}
            aria-label="Fechar"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {isRandomMode
                ? 'Cumpra a missão sorteada para destacar seu registro no telão!'
                : 'Tire fotos temáticas e complete as missões do evento!'}
            </Typography>
            <Chip
              size="small"
              icon={<CheckIcon sx={{ fontSize: '15px !important' }} />}
              color={completedChallenges.length > 0 ? 'success' : 'default'}
              variant="outlined"
              label={`${completedChallenges.length}/${activeChallenges.length} concluídas`}
            />
          </Box>

          {isRandomMode ? (
            <Stack spacing={2.5}>
              {randomChallenge ? (
                <Box sx={randomChallengeCardStyles}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Chip
                      size="small"
                      icon={<DiceIcon sx={{ fontSize: '15px !important', color: '#000 !important' }} />}
                      label="Sua missão da vez"
                      sx={{ bgcolor: '#f59e0b', color: '#000', fontWeight: 800, fontSize: '0.72rem' }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.3 }}>
                      {randomChallenge.title}
                    </Typography>
                    {randomChallenge.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {randomChallenge.description}
                      </Typography>
                    )}
                  </Box>

                  {isCompleted(randomChallenge.id) && (
                    <Chip
                      size="small"
                      icon={<CheckIcon sx={{ fontSize: '15px !important' }} />}
                      color="success"
                      label="Você já cumpriu esta missão antes!"
                      sx={{ alignSelf: 'center', fontWeight: 600 }}
                    />
                  )}

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                    <Button
                      variant="contained"
                      size="medium"
                      startIcon={<CameraIcon />}
                      onClick={() => handleSelectChallenge(randomChallenge)}
                      sx={{
                        bgcolor: '#f59e0b',
                        color: '#000',
                        fontWeight: 800,
                        '&:hover': { bgcolor: '#d97706' }
                      }}
                    >
                      {isCompleted(randomChallenge.id) ? 'Cumprir novamente' : 'Tirar foto desta missão'}
                    </Button>

                    {activeChallenges.length > 1 && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ShuffleIcon />}
                        onClick={() => pickRandom(randomChallenge.id)}
                        sx={{ color: 'text.secondary', borderColor: 'divider' }}
                      >
                        Sortear outra missão
                      </Button>
                    )}
                  </Box>
                </Box>
              ) : (
                <Alert severity="info">Nenhuma missão ativa disponível no momento.</Alert>
              )}

              <Box>
                <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <CheckIcon color="success" sx={{ fontSize: 18 }} />
                  Missões que você já cumpriu ({completedChallenges.length})
                </Typography>

                {completedChallenges.length > 0 ? (
                  <Stack spacing={1}>
                    {completedChallenges.map((challenge) => (
                      <Box
                        key={challenge.id}
                        onClick={() => handleSelectChallenge(challenge)}
                        sx={challengeCompletedItemCardStyles}
                      >
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <CheckIcon color="success" sx={{ fontSize: 16, flexShrink: 0 }} />
                            <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                              {challenge.title}
                            </Typography>
                          </Box>
                          {challenge.description && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, display: 'block', pl: 2.75 }}>
                              {challenge.description}
                            </Typography>
                          )}
                        </Box>
                        <Chip size="small" color="success" label="Cumprida" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      borderRadius: 2,
                      bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)')
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Você ainda não cumpriu nenhuma missão. Cumpra a missão sorteada acima para começar!
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Stack>
          ) : (
            <Stack spacing={2}>
              {pendingChallenges.length > 0 && (
                <Box>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', mb: 1, display: 'block', letterSpacing: 0.5 }}>
                    Disponíveis para cumprir ({pendingChallenges.length})
                  </Typography>
                  <Stack spacing={1.25}>
                    {pendingChallenges.map((challenge) => (
                      <Box
                        key={challenge.id}
                        onClick={() => handleSelectChallenge(challenge)}
                        sx={challengeItemCardStyles}
                      >
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                            {challenge.title}
                          </Typography>
                          {challenge.description && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, display: 'block' }}>
                              {challenge.description}
                            </Typography>
                          )}
                        </Box>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<CameraIcon sx={{ fontSize: '15px !important' }} />}
                          sx={{
                            bgcolor: '#f59e0b',
                            color: '#000',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            flexShrink: 0,
                            '&:hover': { bgcolor: '#d97706' }
                          }}
                        >
                          Cumprir
                        </Button>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              {completedChallenges.length > 0 && (
                <Box sx={{ pt: pendingChallenges.length > 0 ? 1 : 0 }}>
                  <Typography variant="caption" fontWeight={700} color="success.main" sx={{ textTransform: 'uppercase', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5, letterSpacing: 0.5 }}>
                    <CheckIcon sx={{ fontSize: 16 }} />
                    Já cumpridas por você ({completedChallenges.length})
                  </Typography>
                  <Stack spacing={1.25}>
                    {completedChallenges.map((challenge) => (
                      <Box
                        key={challenge.id}
                        onClick={() => handleSelectChallenge(challenge)}
                        sx={challengeCompletedItemCardStyles}
                      >
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <CheckIcon color="success" sx={{ fontSize: 16, flexShrink: 0 }} />
                            <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                              {challenge.title}
                            </Typography>
                          </Box>
                          {challenge.description && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25, display: 'block', pl: 2.75 }}>
                              {challenge.description}
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                          <Chip size="small" color="success" label="Cumprida" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
                          <IconButton size="small" color="inherit" aria-label="Cumprir novamente" title="Cumprir novamente">
                            <RepeatIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              {activeChallenges.length === 0 && (
                <Alert severity="info">Nenhuma missão ativa disponível no momento.</Alert>
              )}
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default GuestUpload
