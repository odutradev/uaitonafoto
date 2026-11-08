import { useEffect, useState } from 'react'
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { getMeData } from '@actions/auth'
import { createEvent } from '@actions/events'
import EventFormFields from '@components/eventFormFields'
import { buildInitialEventForm, isValidEventPeriod, isValidEventPin, toEventPayload } from '@components/eventFormFields/utils'
import { getErrorMessage } from '@config/events'
import useAuth from '@hooks/useAuth'
import useAuthStore from '@stores/auth'

import { dialogActionsStyles, dialogButtonStyles, dialogPaperStyles } from './styles'
import type { FormEvent } from 'react'
import type { EventFormState } from '@components/eventFormFields/types'
import type { CreateEventDialogProps } from './types'

const CreateEventDialog = ({ open, onClose, onCreated }: CreateEventDialogProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const updateUser = useAuthStore((state) => state.updateUser)

  const paidCredits = user?.paidCredits ?? 0
  const freeCredits = user?.freeCredits ?? 0
  const hasCredits = paidCredits > 0 || freeCredits > 0
  const defaultCreditType = paidCredits > 0 ? 'paid' : freeCredits > 0 ? 'free' : 'paid'

  const [form, setForm] = useState<EventFormState>(() => buildInitialEventForm(defaultCreditType))
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(buildInitialEventForm(defaultCreditType))
    }
  }, [open, defaultCreditType])

  const setField = <K extends keyof EventFormState>(key: K, value: EventFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!hasCredits) {
      toast.error('Você não possui créditos para criar um evento.')
      return
    }

    if (form.creditType === 'paid' && paidCredits <= 0) {
      toast.error('Você não possui créditos normais disponíveis.')
      return
    }

    if (form.creditType === 'free' && freeCredits <= 0) {
      toast.error('Você não possui créditos de teste grátis disponíveis.')
      return
    }

    if (!isValidEventPeriod(form)) {
      toast.error('O término do evento deve ser depois do início.')
      return
    }

    if (!isValidEventPin(form)) {
      toast.error('O PIN de acesso deve ter exatamente 4 dígitos numéricos.')
      return
    }

    setIsSubmitting(true)
    try {
      const created = await createEvent(toEventPayload(form))
      toast.success('Evento criado!')
      getMeData().then(updateUser).catch(() => undefined)
      setForm(buildInitialEventForm(defaultCreditType))
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
          {!hasCredits && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Você não possui créditos para criar eventos. Adquira créditos avulsos ou assine um plano para começar.
            </Alert>
          )}

          <EventFormFields
            isCreate
            form={form}
            onChange={setField}
            paidCredits={paidCredits}
            freeCredits={freeCredits}
          />
        </DialogContent>

        <DialogActions sx={dialogActionsStyles}>
          <Button type="button" variant="outlined" onClick={onClose} sx={dialogButtonStyles}>
            Cancelar
          </Button>
          {!hasCredits ? (
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={() => {
                onClose()
                navigate('/app/billing')
              }}
              sx={dialogButtonStyles}
            >
              Adquirir créditos
            </Button>
          ) : (
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} sx={dialogButtonStyles}>
              {isSubmitting ? 'Criando...' : 'Criar evento'}
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default CreateEventDialog
