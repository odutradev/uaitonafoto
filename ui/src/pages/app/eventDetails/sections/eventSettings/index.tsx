import { useEffect, useState } from 'react'
import { Box, Button, Card, CircularProgress, Typography } from '@mui/material'
import { DeleteOutline as DeleteIcon, SaveOutlined as SaveIcon } from '@mui/icons-material'
import { toast } from 'react-toastify'

import EventFormFields from '@components/eventFormFields'
import { isValidEventPeriod, isValidEventPin, toEventForm, toEventPayload } from '@components/eventFormFields/utils'
import Modal from '@components/modal'

import {
  dangerCardStyles,
  dangerRowStyles,
  settingsActionsRowStyles,
  settingsButtonStyles,
  settingsCardStyles,
  settingsSectionStackStyles
} from './styles'
import type { FormEvent } from 'react'
import type { EventFormState } from '@components/eventFormFields/types'
import type { EventSettingsProps } from './types'

const EventSettings = ({ event, onSave, onDelete }: EventSettingsProps) => {
  const initialForm = toEventForm(event)
  const [form, setForm] = useState<EventFormState>(() => initialForm)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setForm(toEventForm(event))
  }, [event])

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm)

  const setField = <K extends keyof EventFormState>(key: K, value: EventFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const handleSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault()

    if (!isValidEventPeriod(form)) {
      toast.error('O término do evento deve ser depois do início.')
      return
    }

    if (!isValidEventPin(form)) {
      toast.error('O PIN de acesso deve ter exatamente 4 dígitos numéricos.')
      return
    }

    setIsSaving(true)
    await onSave(toEventPayload(form))
    setIsSaving(false)
  }

  const handleConfirmDelete = async () => {
    if (!onDelete) return
    setIsDeleting(true)
    await onDelete()
    setIsDeleting(false)
    setIsDeleteModalOpen(false)
  }

  return (
    <Box sx={settingsSectionStackStyles}>
      <Card elevation={0} component="form" onSubmit={handleSubmit} sx={settingsCardStyles}>
        <Box>
          <Typography variant="h6" component="h2">
            Dados e regras do evento
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Ajuste o nome, datas de início e fim, visibilidade no mural e limites de envio por convidado.
          </Typography>
        </Box>

        <EventFormFields form={form} onChange={setField} />

        <Box sx={settingsActionsRowStyles}>
          {isDirty && (
            <Button
              type="button"
              variant="outlined"
              disabled={isSaving}
              onClick={() => setForm(initialForm)}
              sx={settingsButtonStyles}
            >
              Descartar alterações
            </Button>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={!isDirty || isSaving}
            startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon fontSize="small" />}
            sx={settingsButtonStyles}
          >
            {isSaving ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </Box>
      </Card>

      {event.myRole === 'creator' && onDelete && (
        <Card elevation={0} sx={dangerCardStyles}>
          <Box sx={dangerRowStyles}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" component="h2" color="error.main">
                Excluir evento
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                Remove permanentemente o evento, o mural de convidados e todas as fotos enviadas. Esta ação não pode ser desfeita.
              </Typography>
            </Box>

            <Button
              type="button"
              color="error"
              variant="outlined"
              startIcon={<DeleteIcon fontSize="small" />}
              onClick={() => setIsDeleteModalOpen(true)}
              sx={settingsButtonStyles}
            >
              Excluir evento
            </Button>
          </Box>
        </Card>
      )}

      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        variant="danger"
        title="Excluir evento permanentemente?"
        description={
          <>
            Tem certeza que deseja excluir <strong>{event.name}</strong> e todas as fotos registradas? Esta ação não pode ser desfeita.
          </>
        }
        primaryAction={{
          label: isDeleting ? 'Excluindo...' : 'Sim, excluir evento',
          onClick: handleConfirmDelete,
          loading: isDeleting,
          color: 'error'
        }}
        secondaryAction={{
          label: 'Cancelar',
          onClick: () => setIsDeleteModalOpen(false),
          disabled: isDeleting
        }}
      />
    </Box>
  )
}

export default EventSettings
