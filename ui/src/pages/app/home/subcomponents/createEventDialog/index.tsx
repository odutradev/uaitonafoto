import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import { toast } from 'react-toastify'

import {
  dialogActionsStyles,
  dialogButtonStyles,
  dialogPaperStyles,
  formFieldsStackStyles,
  twoColsRowStyles
} from './styles'
import type { FormEvent } from 'react'
import type { CreateEventDialogProps, EventModerationOption, EventTierOption } from './types'

const toSlug = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const CreateEventDialog = ({
  open,
  paidCredits,
  freeCredits,
  onClose,
  onGoToBilling
}: CreateEventDialogProps) => {
  const defaultTier: EventTierOption = paidCredits > 0 ? 'PRO_UNLOCKED' : 'FREE_TRIAL'

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [eventDate, setEventDate] = useState('')
  const [moderationMode, setModerationMode] = useState<EventModerationOption>('AUTO')
  const [tier, setTier] = useState<EventTierOption>(defaultTier)

  const hasAnyCredit = paidCredits > 0 || freeCredits > 0

  const handleTitleChange = (nextTitle: string) => {
    setTitle(nextTitle)
    if (!slugTouched) {
      setSlug(toSlug(nextTitle))
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim() || !eventDate) {
      toast.error('Informe o nome e a data do evento.')
      return
    }

    if (!hasAnyCredit) {
      toast.info('Adquira ou resgate um crédito antes de ativar o evento.')
      return
    }

    toast.info('A ativação de eventos ao vivo será liberada em breve!')
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} slotProps={{ paper: { sx: dialogPaperStyles } }}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Criar novo evento</DialogTitle>

        <DialogContent>
          <Box sx={formFieldsStackStyles}>
            {!hasAnyCredit && (
              <Alert
                severity="info"
                sx={{ borderRadius: '14px' }}
                action={
                  <Button color="inherit" size="small" onClick={onGoToBilling}>
                    Ver créditos
                  </Button>
                }
              >
                Você não possui créditos ativos no momento. Resgate seu teste grátis ou adquira um passe na aba de planos.
              </Alert>
            )}

            <TextField
              label="Nome do evento"
              placeholder="Ex: Casamento Marina & Pedro"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Identificador do link (QR Code)"
              placeholder="casamento-marina-e-pedro"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true)
                setSlug(toSlug(e.target.value))
              }}
              helperText={slug ? `Link dos convidados: /e/${slug}` : 'Gerado automaticamente a partir do nome.'}
              fullWidth
            />

            <Box sx={twoColsRowStyles}>
              <TextField
                label="Data do evento"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                required
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel id="event-moderation-label">Moderação do telão</InputLabel>
                <Select
                  labelId="event-moderation-label"
                  label="Moderação do telão"
                  value={moderationMode}
                  onChange={(e) => setModerationMode(e.target.value as EventModerationOption)}
                >
                  <MenuItem value="AUTO">Automática inteligente</MenuItem>
                  <MenuItem value="MANUAL_PIN">Manual com PIN de equipe</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <FormControl fullWidth>
              <InputLabel id="event-tier-label">Tipo de crédito a utilizar</InputLabel>
              <Select
                labelId="event-tier-label"
                label="Tipo de crédito a utilizar"
                value={tier}
                onChange={(e) => setTier(e.target.value as EventTierOption)}
              >
                <MenuItem value="PRO_UNLOCKED" disabled={paidCredits === 0}>
                  Passe Completo ({paidCredits} {paidCredits === 1 ? 'disponível' : 'disponíveis'})
                </MenuItem>
                <MenuItem value="FREE_TRIAL" disabled={freeCredits === 0}>
                  Teste Grátis — até 25 fotos ({freeCredits} {freeCredits === 1 ? 'disponível' : 'disponíveis'})
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={dialogActionsStyles}>
          <Button type="button" variant="outlined" onClick={onClose} sx={dialogButtonStyles}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!hasAnyCredit}
            sx={dialogButtonStyles}
          >
            Criar evento
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default CreateEventDialog
