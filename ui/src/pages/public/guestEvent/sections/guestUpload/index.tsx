import { useRef } from 'react'
import { Alert, Box, Button, Chip, Paper, Typography } from '@mui/material'
import { AddAPhotoOutlined as CameraIcon } from '@mui/icons-material'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

import { uploadButtonStyles, uploadHeaderStyles, uploadPaperStyles } from './styles'
import type { ChangeEvent } from 'react'
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
  const canUpload = event.phase === 'open'

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

    await onUpload(file)
  }

  return (
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

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={handleFileChange}
      />

      <Button
        variant="contained"
        size="large"
        startIcon={<CameraIcon />}
        disabled={!canUpload || isUploading}
        onClick={() => inputRef.current?.click()}
        sx={uploadButtonStyles}
      >
        {isUploading ? 'Enviando foto...' : 'Tirar foto'}
      </Button>

      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
        Abre a câmera na hora • Fotos antigas da galeria não são permitidas
      </Typography>
    </Paper>
  )
}

export default GuestUpload

