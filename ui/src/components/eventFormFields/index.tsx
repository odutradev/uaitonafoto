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
import dayjs from 'dayjs'

import {
  eventTypeLabels,
  generateRandomPin,
  photoVisibilityLabels,
  pinRotationLabels
} from '@config/events'

import { formFieldsStackStyles, pinCardBoxStyles, pinToggleRowStyles, twoColsRowStyles } from './styles'
import type { CreateEventPayload, EventCreditType, EventItem, EventType, PhotoVisibility, PinRotationMinutes } from '@actions/events/types'
import type { EventFormFieldsProps, EventFormState } from './types'

const DATETIME_INPUT_FORMAT = 'YYYY-MM-DDTHH:mm'

export const buildInitialEventForm = (defaultCreditType: EventCreditType = 'paid'): EventFormState => {
  const start = dayjs().add(1, 'hour').startOf('hour')
  const isFree = defaultCreditType === 'free'
  return {
    name: '',
    type: 'wedding',
    creditType: defaultCreditType,
    startsAt: start.format(DATETIME_INPUT_FORMAT),
    endsAt: '',
    photoVisibility: 'during_event',
    uploadWindowHours: 0,
    galleryDurationDays: isFree ? 14 : 90,
    pinEnabled: true,
    pin: generateRandomPin(),
    pinRotate: true,
    pinRotationMinutes: 15,
    moderationEnabled: false,
    challengesEnabled: false,
    challengesMode: 'choose'
  }
}

export const toEventForm = (event: EventItem): EventFormState => ({
  name: event.name,
  type: event.type,
  creditType: event.creditType ?? 'paid',
  startsAt: dayjs(event.startsAt).format(DATETIME_INPUT_FORMAT),
  endsAt: dayjs(event.endsAt).format(DATETIME_INPUT_FORMAT),
  photoVisibility: event.settings.photoVisibility,
  uploadWindowHours: event.settings.uploadWindowHours,
  galleryDurationDays: event.settings.galleryDurationDays,
  pinEnabled: event.settings.pinEnabled,
  pin: event.settings.pin,
  pinRotate: event.settings.pinRotate,
  pinRotationMinutes: event.settings.pinRotationMinutes,
  moderationEnabled: Boolean(event.settings.moderationEnabled),
  challengesEnabled: Boolean(event.settings.challengesEnabled),
  challengesMode: event.settings.challengesMode ?? 'choose',
  customization: event.customization
})

export const isValidEventPeriod = (form: EventFormState): boolean =>
  !form.endsAt || dayjs(form.endsAt).isAfter(dayjs(form.startsAt))

export const isValidEventPin = (form: EventFormState): boolean =>
  !form.pinEnabled || /^\d{4}$/.test(form.pin)

export const toEventPayload = (form: EventFormState): CreateEventPayload => {
  const durationHours = form.creditType === 'free' ? 4 : 8
  const calculatedEndsAt = dayjs(form.startsAt).add(durationHours, 'hour').toISOString()
  const galleryDays = form.creditType === 'free' ? 14 : 90

  return {
    name: form.name.trim(),
    type: form.type,
    creditType: form.creditType,
    startsAt: dayjs(form.startsAt).toISOString(),
    endsAt: form.endsAt ? dayjs(form.endsAt).toISOString() : calculatedEndsAt,
    settings: {
      photoVisibility: form.photoVisibility,
      uploadWindowHours: form.uploadWindowHours ?? 0,
      galleryDurationDays: form.galleryDurationDays ?? galleryDays,
      pinEnabled: form.pinEnabled,
      pin: form.pin,
      pinRotate: form.pinRotate,
      pinRotationMinutes: form.pinRotationMinutes,
      moderationEnabled: form.moderationEnabled,
      challengesEnabled: form.challengesEnabled,
      challengesMode: form.challengesMode ?? 'choose'
    },
    customization: form.customization
  }
}

const EventFormFields = ({
  form,
  onChange,
  isCreate = false,
  isEventStarted = false,
  step,
  paidCredits = 0,
  freeCredits = 0
}: EventFormFieldsProps) => {
  const handleCreditChange = (creditType: EventCreditType) => {
    onChange('creditType', creditType)
    onChange('galleryDurationDays', creditType === 'free' ? 14 : 90)
    onChange('uploadWindowHours', 0)
  }

  if (step === 0) {
    return (
      <Box sx={formFieldsStackStyles}>
        {isCreate && (
          <TextField
            select
            label="Crédito a debitar"
            value={form.creditType}
            onChange={(e) => handleCreditChange(e.target.value as EventCreditType)}
            helperText={
              form.creditType === 'paid'
                ? 'Duração: 8h de evento ao vivo • Galeria ativa por 90 dias'
                : 'Duração: 4h de evento ao vivo • Galeria ativa por 14 dias'
            }
            fullWidth
          >
            <MenuItem value="paid" disabled={paidCredits <= 0}>
              Crédito Normal (8h de evento • 90 dias de galeria) — {paidCredits} {paidCredits === 1 ? 'disponível' : 'disponíveis'}
            </MenuItem>
            <MenuItem value="free" disabled={freeCredits <= 0}>
              Teste Grátis (4h de evento • 14 dias de galeria) — {freeCredits} {freeCredits === 1 ? 'disponível' : 'disponíveis'}
            </MenuItem>
          </TextField>
        )}

        <Box sx={twoColsRowStyles}>
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
        </Box>

        <TextField
          label="Início do evento"
          type="datetime-local"
          value={form.startsAt}
          onChange={(e) => onChange('startsAt', e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          helperText={`O sistema e telão ficarão abertos por ${form.creditType === 'free' ? '4' : '8'} horas a partir do início.`}
          required
          fullWidth
        />
      </Box>
    )
  }

  if (step === 1) {
    return (
      <Box sx={formFieldsStackStyles}>
        <TextField
          select
          label="Fotos visíveis"
          value={form.photoVisibility}
          onChange={(e) => onChange('photoVisibility', e.target.value as PhotoVisibility)}
          helperText="Quando as fotos aparecem no telão e no mural."
          fullWidth
        >
          {Object.entries(photoVisibilityLabels).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={pinCardBoxStyles}>
          <Box sx={pinToggleRowStyles}>
            <Box>
              <Typography variant="body2" fontWeight={700}>
                Moderação prévia (Fila de aprovação)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Fotos enviadas pelos convidados só aparecem no telão após aprovação da equipe no painel.
              </Typography>
            </Box>
            <Switch
              size="small"
              checked={form.moderationEnabled}
              onChange={(e) => onChange('moderationEnabled', e.target.checked)}
              inputProps={{ 'aria-label': 'Ativar moderação prévia' }}
            />
          </Box>
        </Box>

        <Box sx={pinCardBoxStyles}>
          <Box sx={pinToggleRowStyles}>
            <Box>
              <Typography variant="body2" fontWeight={700}>
                Missões fotográficas
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ativa uma lista de desafios interativos para os convidados cumprirem fotos temáticas no evento.
              </Typography>
            </Box>
            <Switch
              size="small"
              checked={form.challengesEnabled}
              onChange={(e) => onChange('challengesEnabled', e.target.checked)}
              inputProps={{ 'aria-label': 'Ativar missões fotográficas' }}
            />
          </Box>
        </Box>

        <Box sx={pinCardBoxStyles}>
          <Typography variant="subtitle2" fontWeight={700}>
            Resumo das janelas do evento
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              ⏱️ <strong>Duração ao vivo:</strong> {form.creditType === 'free' ? '4 horas' : '8 horas'} de telão e fotos abertos.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              🖼️ <strong>Retenção da galeria:</strong> disponível por {form.creditType === 'free' ? '14 dias' : '90 dias'} para visualização e download.
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  if (step === 2) {
    return (
      <Box sx={formFieldsStackStyles}>
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
  }

  return (
    <Box sx={formFieldsStackStyles}>
      {isCreate && (
        <TextField
          select
          label="Crédito a debitar"
          value={form.creditType}
          onChange={(e) => handleCreditChange(e.target.value as EventCreditType)}
          helperText={
            form.creditType === 'paid'
              ? 'Duração: 8h de evento ao vivo • Galeria ativa por 90 dias'
              : 'Duração: 4h de evento ao vivo • Galeria ativa por 14 dias'
          }
          fullWidth
        >
          <MenuItem value="paid" disabled={paidCredits <= 0}>
            Crédito Normal (8h de evento • 90 dias de galeria) — {paidCredits} {paidCredits === 1 ? 'disponível' : 'disponíveis'}
          </MenuItem>
          <MenuItem value="free" disabled={freeCredits <= 0}>
            Teste Grátis (4h de evento • 14 dias de galeria) — {freeCredits} {freeCredits === 1 ? 'disponível' : 'disponíveis'}
          </MenuItem>
        </TextField>
      )}

      <Box sx={twoColsRowStyles}>
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
      </Box>

      <TextField
        label="Início do evento"
        type="datetime-local"
        value={form.startsAt}
        disabled={isEventStarted}
        onChange={(e) => {
          onChange('startsAt', e.target.value)
          const durationHours = form.creditType === 'free' ? 4 : 8
          if (e.target.value) {
            onChange('endsAt', dayjs(e.target.value).add(durationHours, 'hour').format('YYYY-MM-DDTHH:mm'))
          }
        }}
        slotProps={{ inputLabel: { shrink: true } }}
        helperText={
          isEventStarted
            ? 'O evento já foi iniciado. A data e hora de início não podem mais ser alteradas.'
            : `O sistema e telão ficarão abertos por ${form.creditType === 'free' ? '4' : '8'} horas a partir do início.`
        }
        required
        fullWidth
      />

      <TextField
        select
        label="Fotos visíveis"
        value={form.photoVisibility}
        onChange={(e) => onChange('photoVisibility', e.target.value as PhotoVisibility)}
        helperText="Quando as fotos aparecem no telão e no mural."
        fullWidth
      >
        {Object.entries(photoVisibilityLabels).map(([value, label]) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </TextField>

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

    <Box sx={pinCardBoxStyles}>
      <Box sx={pinToggleRowStyles}>
        <Box>
          <Typography variant="body2" fontWeight={700}>
            Moderação prévia (Fila de aprovação)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Fotos enviadas pelos convidados só aparecem no telão após aprovação da equipe no painel do Álbum.
          </Typography>
        </Box>
        <Switch
          size="small"
          checked={form.moderationEnabled}
          onChange={(e) => onChange('moderationEnabled', e.target.checked)}
          inputProps={{ 'aria-label': 'Ativar moderação prévia' }}
        />
      </Box>
    </Box>

    <Box sx={pinCardBoxStyles}>
      <Box sx={pinToggleRowStyles}>
        <Box>
          <Typography variant="body2" fontWeight={700}>
            Missões fotográficas
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Ativa uma lista de desafios interativos para os convidados cumprirem fotos temáticas no evento.
          </Typography>
        </Box>
        <Switch
          size="small"
          checked={form.challengesEnabled}
          onChange={(e) => onChange('challengesEnabled', e.target.checked)}
          inputProps={{ 'aria-label': 'Ativar missões fotográficas' }}
        />
      </Box>

      {form.challengesEnabled && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Distribuição dos desafios"
            value={form.challengesMode ?? 'choose'}
            onChange={(e) => onChange('challengesMode', e.target.value as 'choose' | 'random')}
            helperText={
              (form.challengesMode ?? 'choose') === 'choose'
                ? 'O convidado vê a lista de missões disponíveis e escolhe qual quer cumprir.'
                : 'O sistema sorteia uma missão surpresa automaticamente para o convidado.'
            }
          >
            <MenuItem value="choose">Escolha livre (convidado escolhe da lista)</MenuItem>
            <MenuItem value="random">Sorteio aleatório (missão sorteada automaticamente)</MenuItem>
          </TextField>
        </Box>
      )}
    </Box>
  </Box>
)
}

export default EventFormFields
