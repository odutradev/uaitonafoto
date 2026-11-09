import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Typography
} from '@mui/material'
import {
  PlayArrow as StartIcon,
  Replay as ReopenIcon,
  StopCircleOutlined as CloseIcon
} from '@mui/icons-material'
import dayjs from 'dayjs'

import Modal from '@components/modal'
import { canReopenEvent, getEventPhase, getEventRemainingOpenTime } from '@config/eventPhase'
import { eventPhaseLabels, eventTypeLabels } from '@config/events'
import { brandColors } from '@theme'

import {
  liveDotStyles,
  statusActionRowStyles,
  statusControlCardStyles,
  statusHeaderRowStyles,
  statusInfoColumnStyles
} from './styles'
import type { EventStatusControlProps } from './types'

const EventStatusControl = ({ event, onStart, onClose, onReopen }: EventStatusControlProps) => {
  const [isStartModalOpen, setIsStartModalOpen] = useState(false)
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false)
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const phase = getEventPhase(event)
  const canReopen = canReopenEvent(event)
  const remaining = getEventRemainingOpenTime(event)
  const durationHours = event.creditType === 'free' ? 4 : 8

  const handleConfirmStart = async () => {
    setIsSubmitting(true)
    await onStart()
    setIsSubmitting(false)
    setIsStartModalOpen(false)
  }

  const handleConfirmClose = async () => {
    setIsSubmitting(true)
    await onClose()
    setIsSubmitting(false)
    setIsCloseModalOpen(false)
  }

  const handleConfirmReopen = async () => {
    setIsSubmitting(true)
    await onReopen()
    setIsSubmitting(false)
    setIsReopenModalOpen(false)
  }

  return (
    <>
      <Card elevation={0} sx={statusControlCardStyles}>
        <Box sx={statusInfoColumnStyles}>
          <Box sx={statusHeaderRowStyles}>
            <Typography variant="h6" fontWeight={800} component="h1" sx={{ letterSpacing: '-0.02em' }}>
              {event.name}
            </Typography>

            <Chip
              size="small"
              variant="outlined"
              label={eventTypeLabels[event.type] ?? event.type}
              sx={{ fontWeight: 600, fontSize: '0.75rem' }}
            />

            {phase === 'open' && (
              <Chip
                size="small"
                icon={<Box sx={liveDotStyles} />}
                label="AO VIVO"
                sx={{
                  bgcolor: 'rgba(34, 197, 94, 0.15)',
                  color: '#22c55e',
                  borderColor: 'rgba(34, 197, 94, 0.35)',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  letterSpacing: '0.04em'
                }}
              />
            )}

            {phase === 'upcoming' && (
              <Chip
                size="small"
                color="primary"
                variant="outlined"
                label={eventPhaseLabels.upcoming}
                sx={{ fontWeight: 700 }}
              />
            )}

            {phase === 'closed' && (
              <Chip
                size="small"
                color="default"
                variant="outlined"
                label={eventPhaseLabels.closed}
                sx={{ fontWeight: 700 }}
              />
            )}

            {phase === 'expired' && (
              <Chip
                size="small"
                color="default"
                variant="outlined"
                label={eventPhaseLabels.expired}
                sx={{ fontWeight: 700 }}
              />
            )}
          </Box>

          <Typography variant="body2" color="text.secondary">
            {phase === 'upcoming' && (
              <>Início previsto para <strong>{dayjs(event.startsAt).format('DD/MM/YYYY [às] HH:mm')}</strong> • Duração de {durationHours}h.</>
            )}
            {phase === 'open' && (
              <>Evento iniciado às <strong>{dayjs(event.startsAt).format('HH:mm')}</strong> • Encerramento previsto para <strong>{dayjs(event.endsAt).format('DD/MM/YYYY [às] HH:mm')}</strong>.</>
            )}
            {phase === 'closed' && canReopen && (
              <>Evento encerrado • Janela de {durationHours}h ativa (restam <strong>{remaining ? `${remaining.hours}h ${remaining.minutes}min` : ''}</strong> para reabertura).</>
            )}
            {phase === 'closed' && !canReopen && (
              <>Evento encerrado definitivamente • Galeria de fotos liberada.</>
            )}
            {phase === 'expired' && <>A galeria deste evento expirou.</>}
          </Typography>
        </Box>

        <Box sx={statusActionRowStyles}>
          {phase === 'upcoming' && (
            <Button
              variant="contained"
              size="medium"
              startIcon={<StartIcon />}
              onClick={() => setIsStartModalOpen(true)}
              sx={{
                bgcolor: brandColors.flashYellow,
                color: brandColors.ink,
                fontWeight: 800,
                borderRadius: '12px',
                '&:hover': {
                  bgcolor: '#F5C30A'
                }
              }}
            >
              Iniciar evento agora
            </Button>
          )}

          {phase === 'open' && (
            <Button
              variant="outlined"
              color="error"
              size="medium"
              startIcon={<CloseIcon />}
              onClick={() => setIsCloseModalOpen(true)}
              sx={{ borderRadius: '12px', fontWeight: 800 }}
            >
              Encerrar evento
            </Button>
          )}

          {phase === 'closed' && canReopen && (
            <Button
              variant="contained"
              color="primary"
              size="medium"
              startIcon={<ReopenIcon />}
              onClick={() => setIsReopenModalOpen(true)}
              sx={{ borderRadius: '12px', fontWeight: 800 }}
            >
              Reabrir evento
            </Button>
          )}
        </Box>
      </Card>

      {/* Modal Iniciar Evento */}
      <Modal
        open={isStartModalOpen}
        onClose={() => !isSubmitting && setIsStartModalOpen(false)}
        title="Iniciar evento manualmente?"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Typography variant="body1">
            Deseja iniciar o evento <strong>{event.name}</strong> agora?
          </Typography>
          <Alert severity="info" sx={{ borderRadius: '12px' }}>
            A data e hora de início será atualizada para o momento atual e o evento ficará liberado para fotos e telão ao vivo pelas próximas <strong>{durationHours} horas</strong>.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            <strong>Atenção:</strong> a partir do momento em que o evento for iniciado, a data e hora de início não poderão mais ser alteradas.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
            <Button
              variant="outlined"
              onClick={() => setIsStartModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <StartIcon />}
              onClick={handleConfirmStart}
              disabled={isSubmitting}
              sx={{
                bgcolor: brandColors.flashYellow,
                color: brandColors.ink,
                fontWeight: 800,
                '&:hover': { bgcolor: '#F5C30A' }
              }}
            >
              {isSubmitting ? 'Iniciando...' : 'Iniciar agora'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal Encerrar Evento */}
      <Modal
        open={isCloseModalOpen}
        onClose={() => !isSubmitting && setIsCloseModalOpen(false)}
        title="Encerrar evento?"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Typography variant="body1">
            Tem certeza de que deseja encerrar o evento <strong>{event.name}</strong>?
          </Typography>
          <Alert severity="warning" sx={{ borderRadius: '12px' }}>
            Ao encerrar o evento:
            <Box component="ul" sx={{ pl: 2.5, m: 0, mt: 0.5 }}>
              <li>Os convidados <strong>não poderão mais enviar fotos</strong>.</li>
              <li>A <strong>galeria completa de fotos será liberada</strong> para visualização.</li>
              <li>Você poderá reabri-lo a qualquer momento dentro do limite de <strong>{durationHours} horas</strong> do evento.</li>
            </Box>
          </Alert>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
            <Button
              variant="outlined"
              onClick={() => setIsCloseModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <CloseIcon />}
              onClick={handleConfirmClose}
              disabled={isSubmitting}
              sx={{ fontWeight: 800 }}
            >
              {isSubmitting ? 'Encerrando...' : 'Confirmar encerramento'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal Reabrir Evento */}
      <Modal
        open={isReopenModalOpen}
        onClose={() => !isSubmitting && setIsReopenModalOpen(false)}
        title="Reabrir evento?"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Typography variant="body1">
            Deseja reabrir o evento <strong>{event.name}</strong>?
          </Typography>
          <Alert severity="success" sx={{ borderRadius: '12px' }}>
            O evento será reativado e o envio de fotos voltará a ficar disponível para os convidados até o término das <strong>{durationHours} horas</strong> do evento
            {remaining ? ` (restam aproximadamente ${remaining.hours}h ${remaining.minutes}min)` : ''}.
          </Alert>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
            <Button
              variant="outlined"
              onClick={() => setIsReopenModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <ReopenIcon />}
              onClick={handleConfirmReopen}
              disabled={isSubmitting}
              sx={{ fontWeight: 800 }}
            >
              {isSubmitting ? 'Reabrindo...' : 'Reabrir evento'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default EventStatusControl
