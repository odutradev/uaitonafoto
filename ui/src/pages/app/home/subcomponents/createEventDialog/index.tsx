import { useEffect, useState } from 'react'
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { getMeData } from '@actions/auth'
import { createEvent } from '@actions/events'
import EventFormFields from '@components/eventFormFields'
import Stepper from '@components/stepper'
import { buildInitialEventForm, isValidEventPeriod, isValidEventPin, toEventPayload } from '@components/eventFormFields/utils'
import { getErrorMessage } from '@config/events'
import useAuth from '@hooks/useAuth'
import useAuthStore from '@stores/auth'

import { dialogActionsStyles, dialogButtonStyles, dialogPaperStyles } from './styles'
import type { FormEvent } from 'react'
import type { EventFormState } from '@components/eventFormFields/types'
import type { CreateEventDialogProps } from './types'

const STEPS = [
  { label: 'Básico', description: 'Dados essenciais' },
  { label: 'Dinâmica', description: 'Fotos e telão' },
  { label: 'Acesso', description: 'Senha e PIN' }
]

const CreateEventDialog = ({ open, onClose, onCreated }: CreateEventDialogProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const updateUser = useAuthStore((state) => state.updateUser)

  const paidCredits = user?.paidCredits ?? 0
  const freeCredits = user?.freeCredits ?? 0
  const hasCredits = paidCredits > 0 || freeCredits > 0
  const defaultCreditType = paidCredits > 0 ? 'paid' : freeCredits > 0 ? 'free' : 'paid'

  const [activeStep, setActiveStep] = useState(0)
  const [form, setForm] = useState<EventFormState>(() => buildInitialEventForm(defaultCreditType))
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setActiveStep(0)
      setForm(buildInitialEventForm(defaultCreditType))
    }
  }, [open, defaultCreditType])

  const setField = <K extends keyof EventFormState>(key: K, value: EventFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const validateStep = (stepIndex: number): boolean => {
    if (stepIndex === 0) {
      if (!hasCredits) {
        toast.error('Você não possui créditos para criar um evento.')
        return false
      }
      if (form.creditType === 'paid' && paidCredits <= 0) {
        toast.error('Você não possui créditos normais disponíveis.')
        return false
      }
      if (form.creditType === 'free' && freeCredits <= 0) {
        toast.error('Você não possui créditos de teste grátis disponíveis.')
        return false
      }
      if (!form.name.trim()) {
        toast.error('Informe o nome do evento.')
        return false
      }
      if (!form.startsAt) {
        toast.error('Informe a data e hora de início.')
        return false
      }
      return true
    }

    if (stepIndex === 1) {
      return true
    }

    if (stepIndex === 2) {
      if (!isValidEventPin(form)) {
        toast.error('O PIN de acesso deve ter exatamente 4 dígitos numéricos.')
        return false
      }
      return true
    }

    return true
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((current) => Math.min(current + 1, STEPS.length - 1))
    }
  }

  const handleBack = () => {
    setActiveStep((current) => Math.max(current - 1, 0))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (activeStep < STEPS.length - 1) {
      handleNext()
      return
    }

    if (!validateStep(0) || !validateStep(1) || !validateStep(2)) {
      return
    }

    if (!isValidEventPeriod(form)) {
      toast.error('O término do evento deve ser depois do início.')
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
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={800}>
            Criar novo evento
          </Typography>
          <Box sx={{ mt: 1.5 }}>
            <Stepper
              steps={STEPS}
              activeStep={activeStep}
              onStepClick={(targetStep) => {
                if (targetStep < activeStep || validateStep(activeStep)) {
                  setActiveStep(targetStep)
                }
              }}
              clickablePastSteps
            />
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          {!hasCredits && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Você não possui créditos para criar eventos. Adquira créditos avulsos ou assine um plano para começar.
            </Alert>
          )}

          <EventFormFields
            isCreate
            step={activeStep}
            form={form}
            onChange={setField}
            paidCredits={paidCredits}
            freeCredits={freeCredits}
          />
        </DialogContent>

        <DialogActions sx={dialogActionsStyles}>
          {activeStep === 0 ? (
            <Button type="button" variant="outlined" onClick={onClose} sx={dialogButtonStyles}>
              Cancelar
            </Button>
          ) : (
            <Button
              type="button"
              variant="outlined"
              onClick={handleBack}
              disabled={isSubmitting}
              sx={dialogButtonStyles}
            >
              Voltar
            </Button>
          )}

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
          ) : activeStep < STEPS.length - 1 ? (
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleNext}
              sx={dialogButtonStyles}
            >
              Avançar
            </Button>
          ) : (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={dialogButtonStyles}
            >
              {isSubmitting ? 'Criando...' : 'Criar evento'}
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default CreateEventDialog
