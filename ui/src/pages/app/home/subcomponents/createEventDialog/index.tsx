import { useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { toast } from 'react-toastify'

import { createEvent } from '@actions/events'
import EventFormFields from '@components/eventFormFields'
import { buildInitialEventForm, isValidEventPeriod, isValidEventPin, toEventPayload } from '@components/eventFormFields/utils'
import { getErrorMessage } from '@config/events'

import { dialogActionsStyles, dialogButtonStyles, dialogPaperStyles } from './styles'
import type { FormEvent } from 'react'
import type { EventFormState } from '@components/eventFormFields/types'
import type { CreateEventDialogProps } from './types'

const CreateEventDialog = ({ open, onClose, onCreated }: CreateEventDialogProps) => {
  const [form, setForm] = useState<EventFormState>(buildInitialEventForm)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setField = <K extends keyof EventFormState>(key: K, value: EventFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

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
      setForm(buildInitialEventForm())
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
          <EventFormFields form={form} onChange={setField} />
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
