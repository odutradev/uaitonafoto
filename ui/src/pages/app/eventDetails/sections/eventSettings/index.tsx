import { useEffect, useState } from 'react'
import { Box, Button, Paper, Typography } from '@mui/material'
import { toast } from 'react-toastify'

import EventFormFields from '@components/eventFormFields'
import { isValidEventPeriod, toEventForm, toEventPayload } from '@components/eventFormFields/utils'

import { settingsButtonStyles, settingsPaperStyles } from './styles'
import type { FormEvent } from 'react'
import type { EventFormState } from '@components/eventFormFields/types'
import type { EventSettingsProps } from './types'

const EventSettings = ({ event, onSave }: EventSettingsProps) => {
  const [form, setForm] = useState<EventFormState>(() => toEventForm(event))
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setForm(toEventForm(event))
  }, [event])

  const setField = <K extends keyof EventFormState>(key: K, value: EventFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const handleSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault()

    if (!isValidEventPeriod(form)) {
      toast.error('O término do evento deve ser depois do início.')
      return
    }

    setIsSaving(true)
    await onSave(toEventPayload(form))
    setIsSaving(false)
  }

  return (
    <Paper variant="outlined" component="form" onSubmit={handleSubmit} sx={settingsPaperStyles}>
      <Typography variant="h6" component="h2">
        Dados e configurações
      </Typography>
      <Box>
        <EventFormFields form={form} onChange={setField} />
      </Box>
      <Button type="submit" variant="contained" disabled={isSaving} sx={settingsButtonStyles}>
        {isSaving ? 'Salvando...' : 'Salvar alterações'}
      </Button>
    </Paper>
  )
}

export default EventSettings
