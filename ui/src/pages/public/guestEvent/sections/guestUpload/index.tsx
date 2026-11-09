import { useRef, useState } from 'react'
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
  Close as CloseIcon,
  EmojiEventsOutlined as ChallengeIcon,
  StarsRounded as StarIcon
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

import {
  challengeActiveBadgeStyles,
  challengeButtonStyles,
  challengeItemCardStyles,
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
  isUploading,
  onUpload
}: GuestUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState<EventChallenge | null>(null)

  const canUpload = event.phase === 'open'
  const hasChallenges = Boolean(event.challengesEnabled && (event.challenges?.length ?? 0) > 0)
  const activeChallenges = (event.challenges ?? []).filter((c) => c.active !== false)

  const handleNormalPhotoClick = () => {
    setSelectedChallenge(null)
    inputRef.current?.click()
  }

  const handleSelectChallenge = (challenge: EventChallenge) => {
    setSelectedChallenge(challenge)
    setIsChallengeModalOpen(false)
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
          {photosSent > 0 && (
            <Chip
              size="small"
              color="primary"
              label={`${photosSent} ${photosSent === 1 ? 'foto enviada' : 'fotos enviadas'}`}
            />
          )}
        </Box>

        {event.phase === 'upcoming' && (
          <Alert severity="info">
            O envio de fotos começa em {dayjs(event.startsAt).format('DD/MM/YYYY [às] HH:mm')}.
          </Alert>
        )}

        {event.phase === 'closed' && <Alert severity="info">O período de envio de fotos já se encerrou.</Alert>}

        {selectedChallenge && (
          <Box sx={challengeActiveBadgeStyles}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <ChallengeIcon sx={{ fontSize: 20, flexShrink: 0 }} />
              <Typography variant="body2" noWrap>
                Missão ativa: <strong>{selectedChallenge.title}</strong>
              </Typography>
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
              startIcon={<ChallengeIcon />}
              disabled={!canUpload || isUploading}
              onClick={() => setIsChallengeModalOpen(true)}
              sx={challengeButtonStyles}
            >
              {isUploading && selectedChallenge ? 'Enviando missão...' : 'Cumprir um desafio'}
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
            <ChallengeIcon sx={{ color: '#f59e0b' }} />
            <Typography variant="h6" fontWeight={800}>
              Escolha uma Missão
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
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Tire uma foto cumprindo um dos desafios para destacar seu registro no telão ao vivo!
          </Typography>

          <Stack spacing={1.5}>
            {activeChallenges.map((challenge) => (
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
        </DialogContent>
      </Dialog>
    </>
  )
}

export default GuestUpload

