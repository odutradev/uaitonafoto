import { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField
} from '@mui/material'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

import { createEvent } from '@actions/events'
import { eventTypeLabels, getErrorMessage, photoVisibilityLabels } from '@config/events'

import {
  dialogActionsStyles,
  dialogButtonStyles,
  dialogPaperStyles,
  formFieldsStackStyles,
  twoColsRowStyles
} from './styles'
import type { FormEvent } from 'react'
import type { EventType, PhotoVisibility } from '@actions/events/types'
import type { CreateEventDialogProps, CreateEventFormState } from './types'

const DATETIME_INPUT_FORMAT = 'YYYY-MM-DDTHH:mm'

const buildInitialState = (): CreateEventFormState => {
  const start = dayjs().add(1, 'hour').startOf('hour')
  return {
    name: '',
    type: 'wedding',
    startsAt: start.format(DATETIME_INPUT_FORMAT),
    endsAt: start.add(6, 'hour').format(DATETIME_INPUT_FORMAT),
    maxPhotosPerGuest: 10,
    photoVisibility: 'during_event',
    uploadWindowHours: 24,
    galleryDurationDays: 30
  }
}

const CreateEventDialog = ({ open, onClose, onCreated }: CreateEventDialogProps) => {
  const [form, setForm] = useState<CreateEventFormState>(buildInitialState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setField = <K extends keyof CreateEventFormState>(key: K, value: CreateEventFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!dayjs(form.endsAt).isAfter(dayjs(form.startsAt))) {
      toast.error('O término do evento deve ser depois do início.')
      return
    }

    setIsSubmitting(true)
    try {
      const created = await createEvent({
        name: form.name.trim(),
        type: form.type,
        startsAt: dayjs(form.startsAt).toISOString(),
        endsAt: dayjs(form.endsAt).toISOString(),
        settings: {
          maxPhotosPerGuest: form.maxPhotosPerGuest,
          photoVisibility: form.photoVisibility,
          uploadWindowHours: form.uploadWindowHours,
          galleryDurationDays: form.galleryDurationDays
        }
      })
      toast.success('Evento criado!')
      setForm(buildInitialState())
      onCreated(created)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível criar o evento.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} slotProps={{ paper: { sx: dialogPaperStyles } }}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Criar novo evento</DialogTitle>

        <DialogContent>
          <Box sx={formFieldsStackStyles}>
            <TextField
              label="Nome do evento"
              placeholder="Ex: Casamento Marina & Pedro"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              slotProps={{ htmlInput: { maxLength: 120 } }}
              required
              fullWidth
            />

            <TextField
              select
              label="Tipo de evento"
              value={form.type}
              onChange={(e) => setField('type', e.target.value as EventType)}
              fullWidth
            >
              {Object.entries(eventTypeLabels).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={twoColsRowStyles}>
              <TextField
                label="Início"
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => setField('startsAt', e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                required
                fullWidth
              />
              <TextField
                label="Término"
                type="datetime-local"
                value={form.endsAt}
                onChange={(e) => setField('endsAt', e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                required
                fullWidth
              />
            </Box>

            <TextField
              select
              label="Fotos visíveis"
              value={form.photoVisibility}
              onChange={(e) => setField('photoVisibility', e.target.value as PhotoVisibility)}
              helperText="Quando as fotos aparecem no telão e no feed."
              fullWidth
            >
              {Object.entries(photoVisibilityLabels).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={twoColsRowStyles}>
              <TextField
                label="Fotos por convidado"
                type="number"
                value={form.maxPhotosPerGuest}
                onChange={(e) => setField('maxPhotosPerGuest', Number(e.target.value))}
                slotProps={{ htmlInput: { min: 1, max: 100 } }}
                fullWidth
              />
              <TextField
                label="Envio após o fim (horas)"
                type="number"
                value={form.uploadWindowHours}
                onChange={(e) => setField('uploadWindowHours', Number(e.target.value))}
                slotProps={{ htmlInput: { min: 0, max: 168 } }}
                fullWidth
              />
            </Box>

            <TextField
              label="Galeria disponível por (dias após o fim)"
              type="number"
              value={form.galleryDurationDays}
              onChange={(e) => setField('galleryDurationDays', Number(e.target.value))}
              slotProps={{ htmlInput: { min: 1, max: 365 } }}
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions sx={dialogActionsStyles}>
          <Button type="button" variant="outlined" onClick={onClose} sx={dialogButtonStyles}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} sx={dialogButtonStyles}>
            {isSubmitting ? 'Criando...' : 'Criar evento'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default CreateEventDialog
