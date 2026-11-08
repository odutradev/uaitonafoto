import { useRef } from 'react'
import { Alert, Box, Button, Chip, Paper, Typography } from '@mui/material'
import { AddAPhotoOutlined as CameraIcon } from '@mui/icons-material'
import dayjs from 'dayjs'

import { uploadButtonStyles, uploadHeaderStyles, uploadPaperStyles } from './styles'
import type { ChangeEvent } from 'react'
import type { GuestUploadProps } from './types'

const GuestUpload = ({
  event,
  guest,
  photosSent,
  photosRemaining,
  isUploading,
  onUpload
}: GuestUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const canUpload = event.phase === 'open' && photosRemaining > 0

  const handleFileChange = async (changeEvent: ChangeEvent<HTMLInputElement>) => {
    const file = changeEvent.target.files?.[0]
    changeEvent.target.value = ''
    if (file) await onUpload(file)
  }

  return (
    <Paper variant="outlined" sx={uploadPaperStyles}>
      <Box sx={uploadHeaderStyles}>
        <Typography variant="subtitle1" fontWeight={700}>
          Olá, {guest.name}
        </Typography>
        <Chip
          size="small"
          color={photosRemaining > 0 ? 'primary' : 'default'}
          label={`${photosSent} / ${event.maxPhotosPerGuest} fotos`}
        />
      </Box>

      {event.phase === 'upcoming' && (
        <Alert severity="info">
          O envio de fotos começa em {dayjs(event.startsAt).format('DD/MM/YYYY [às] HH:mm')}.
        </Alert>
      )}

      {event.phase === 'closed' && <Alert severity="info">O período de envio de fotos já se encerrou.</Alert>}

      {event.phase === 'open' && photosRemaining === 0 && (
        <Alert severity="info">Você atingiu o limite de fotos deste evento.</Alert>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
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
        {isUploading ? 'Enviando foto...' : 'Tirar ou escolher foto'}
      </Button>
    </Paper>
  )
}

export default GuestUpload

