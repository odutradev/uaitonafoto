import {
  Box,
  IconButton,
  InputAdornment,
  MenuItem,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { RefreshOutlined as RefreshIcon } from '@mui/icons-material'

import {
  eventTypeLabels,
  generateRandomPin,
  photoVisibilityLabels,
  pinRotationLabels
} from '@config/events'

import { formFieldsStackStyles, pinCardBoxStyles, pinToggleRowStyles, twoColsRowStyles } from './styles'
import type { EventType, PhotoVisibility, PinRotationMinutes } from '@actions/events/types'
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

    <Box sx={pinCardBoxStyles}>
      <Box sx={pinToggleRowStyles}>
        <Box>
          <Typography variant="subtitle2" fontWeight={700}>
            Senha de acesso (PIN de 4 dígitos)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Solicita um PIN numérico para os convidados entrarem no evento.
          </Typography>
        </Box>
        <Switch
          checked={form.pinEnabled}
          onChange={(e) => onChange('pinEnabled', e.target.checked)}
          inputProps={{ 'aria-label': 'Exigir PIN de acesso' }}
        />
      </Box>

      {form.pinEnabled && (
        <>
          <Box sx={twoColsRowStyles}>
            <TextField
              label="PIN de 4 dígitos"
              placeholder="0000"
              value={form.pin}
              onChange={(e) => onChange('pin', e.target.value.replace(/\D/g, '').slice(0, 4))}
              slotProps={{
                htmlInput: {
                  inputMode: 'numeric',
                  pattern: '\\d{4}',
                  maxLength: 4
                },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Gerar novo PIN aleatório">
                        <IconButton
                          size="small"
                          edge="end"
                          onClick={() => onChange('pin', generateRandomPin(form.pin))}
                          aria-label="Gerar novo PIN aleatório"
                        >
                          <RefreshIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }
              }}
              helperText="Você pode digitar ou gerar um PIN."
              required
              fullWidth
            />

            {form.pinRotate && (
              <TextField
                select
                label="Tempo de alternância"
                value={form.pinRotationMinutes}
                onChange={(e) => onChange('pinRotationMinutes', Number(e.target.value) as PinRotationMinutes)}
                helperText="Intervalo em que o PIN muda sozinho."
                fullWidth
              >
                {Object.entries(pinRotationLabels).map(([value, label]) => (
                  <MenuItem key={value} value={Number(value)}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Box>

          <Box sx={pinToggleRowStyles}>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                Alternar PIN automaticamente
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {form.pinRotate
                  ? 'O PIN é renovado periodicamente. Desative para manter um PIN fixo.'
                  : 'PIN fixo: permanece o mesmo até ser alterado manualmente.'}
              </Typography>
            </Box>
            <Switch
              checked={form.pinRotate}
              onChange={(e) => onChange('pinRotate', e.target.checked)}
              inputProps={{ 'aria-label': 'Alternar PIN automaticamente' }}
            />
          </Box>
        </>
      )}
    </Box>
  </Box>
)

export default EventFormFields
