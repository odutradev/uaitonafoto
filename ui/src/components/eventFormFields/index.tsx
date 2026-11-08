import { Box, MenuItem, TextField } from '@mui/material'

import { eventTypeLabels, photoVisibilityLabels } from '@config/events'

import { formFieldsStackStyles, twoColsRowStyles } from './styles'
import type { EventType, PhotoVisibility } from '@actions/events/types'
import type { EventFormFieldsProps } from './types'

const EventFormFields = ({ form, onChange }: EventFormFieldsProps) => (
  <Box sx={formFieldsStackStyles}>
    <TextField
      label="Nome do evento"
      placeholder="Ex: Casamento Marina & Pedro"
      value={form.name}
      onChange={(e) => onChange('name', e.target.value)}
      slotProps={{ htmlInput: { maxLength: 120 } }}
      required
      fullWidth
    />

    <TextField
      select
      label="Tipo de evento"
      value={form.type}
      onChange={(e) => onChange('type', e.target.value as EventType)}
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
        onChange={(e) => onChange('startsAt', e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        required
        fullWidth
      />
      <TextField
        label="Término"
        type="datetime-local"
        value={form.endsAt}
        onChange={(e) => onChange('endsAt', e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        required
        fullWidth
      />
    </Box>

    <TextField
      select
      label="Fotos visíveis"
      value={form.photoVisibility}
      onChange={(e) => onChange('photoVisibility', e.target.value as PhotoVisibility)}
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
        onChange={(e) => onChange('maxPhotosPerGuest', Number(e.target.value))}
        slotProps={{ htmlInput: { min: 1, max: 100 } }}
        fullWidth
      />
      <TextField
        label="Envio após o fim (horas)"
        type="number"
        value={form.uploadWindowHours}
        onChange={(e) => onChange('uploadWindowHours', Number(e.target.value))}
        slotProps={{ htmlInput: { min: 0, max: 168 } }}
        fullWidth
      />
    </Box>

    <TextField
      label="Galeria disponível por (dias após o fim)"
      type="number"
      value={form.galleryDurationDays}
      onChange={(e) => onChange('galleryDurationDays', Number(e.target.value))}
      slotProps={{ htmlInput: { min: 1, max: 365 } }}
      fullWidth
    />
  </Box>
)

export default EventFormFields
