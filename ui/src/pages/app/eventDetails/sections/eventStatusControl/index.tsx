import { useState } from "react";
import { Alert, Box, Button, Card, CircularProgress, Typography } from "@mui/material";
import { PlayArrow as StartIcon, Replay as ReopenIcon, StopCircleOutlined as CloseIcon } from "@mui/icons-material";
import dayjs from "dayjs";

import Modal from "@components/modal";
import { canReopenEvent, getEventPhase, getEventRemainingOpenTime } from "@utils/functions/eventPhase";
import { eventPhaseLabels, eventTypeLabels } from "@assets/data/events";
import { brandColors } from "@styles/theme";

import {
  liveDotStyles,
  modalButtonStyles,
  statusActionButtonStyles,
  statusActionRowStyles,
  statusBadgeStyles,
  statusControlCardStyles,
  statusHeaderRowStyles,
  statusInfoColumnStyles
} from "./styles";
import useEventDetailsPage from "@pages/app/eventDetails/hook";

const EventStatusControl = () => {
  const { event: eventValue, start: onStart, close: onClose, reopen: onReopen } = useEventDetailsPage();
  const event = eventValue!;

  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const phase = getEventPhase(event);
  const canReopen = canReopenEvent(event);
  const remaining = getEventRemainingOpenTime(event);
  const durationHours = event.creditType === "free" ? 4 : 8;

  const handleConfirmStart = async () => {
    setIsSubmitting(true);
    await onStart();
    setIsSubmitting(false);
    setIsStartModalOpen(false);
  };

  const handleConfirmClose = async () => {
    setIsSubmitting(true);
    await onClose();
    setIsSubmitting(false);
    setIsCloseModalOpen(false);
  };

  const handleConfirmReopen = async () => {
    setIsSubmitting(true);
    await onReopen();
    setIsSubmitting(false);
    setIsReopenModalOpen(false);
  };

  return (
    <>
      <Card elevation={0} sx={statusControlCardStyles}>
        <Box sx={statusInfoColumnStyles}>
          <Box sx={statusHeaderRowStyles}>
            <Typography variant="h6" fontWeight={700} component="h1" sx={{ fontSize: "1.125rem" }}>
              {event.name}
            </Typography>

            <Box component="span" sx={statusBadgeStyles}>
              {eventTypeLabels[event.type] ?? event.type}
            </Box>

            {phase === "open" && (
              <Box
                component="span"
                sx={{
                  ...statusBadgeStyles,
                  bgcolor: "rgba(34, 197, 94, 0.12)",
                  color: "#22c55e",
                  borderColor: "rgba(34, 197, 94, 0.3)"
                }}
              >
                <Box sx={liveDotStyles} />
                Ao vivo
              </Box>
            )}

            {phase === "upcoming" && (
              <Box
                component="span"
                sx={{
                  ...statusBadgeStyles,
                  color: "primary.main",
                  borderColor: "rgba(255, 207, 31, 0.35)"
                }}
              >
                {eventPhaseLabels.upcoming}
              </Box>
            )}

            {phase === "closed" && (
              <Box component="span" sx={statusBadgeStyles}>
                {eventPhaseLabels.closed}
              </Box>
            )}

            {phase === "expired" && (
              <Box component="span" sx={statusBadgeStyles}>
                {eventPhaseLabels.expired}
              </Box>
            )}
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.8125rem" }}>
            {phase === "upcoming" && (
              <>
                Início previsto para <strong>{dayjs(event.startsAt).format("DD/MM/YYYY [às] HH:mm")}</strong> · Duração
                de {durationHours}h
              </>
            )}
            {phase === "open" && (
              <>
                Iniciado às <strong>{dayjs(event.startsAt).format("HH:mm")}</strong> · Encerramento às{" "}
                <strong>{dayjs(event.endsAt).format("DD/MM/YYYY HH:mm")}</strong>
              </>
            )}
            {phase === "closed" && canReopen && (
              <>
                Evento encerrado · Janela de {durationHours}h ativa (restam{" "}
                <strong>{remaining ? `${remaining.hours}h ${remaining.minutes}min` : ""}</strong> para reabertura)
              </>
            )}
            {phase === "closed" && !canReopen && <>Evento encerrado · Galeria de fotos liberada</>}
            {phase === "expired" && <>A galeria deste evento expirou.</>}
          </Typography>
        </Box>

        <Box sx={statusActionRowStyles}>
          {phase === "upcoming" && (
            <Button
              variant="contained"
              size="small"
              startIcon={<StartIcon fontSize="small" />}
              onClick={() => setIsStartModalOpen(true)}
              sx={{
                ...statusActionButtonStyles,
                bgcolor: brandColors.flashYellow,
                color: brandColors.ink,
                "&:hover": {
                  bgcolor: "#F5C30A"
                }
              }}
            >
              Iniciar evento
            </Button>
          )}

          {phase === "open" && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<CloseIcon fontSize="small" />}
              onClick={() => setIsCloseModalOpen(true)}
              sx={statusActionButtonStyles}
            >
              Encerrar evento
            </Button>
          )}

          {phase === "closed" && canReopen && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<ReopenIcon fontSize="small" />}
              onClick={() => setIsReopenModalOpen(true)}
              sx={statusActionButtonStyles}
            >
              Reabrir evento
            </Button>
          )}
        </Box>
      </Card>

      <Modal
        open={isStartModalOpen}
        onClose={() => !isSubmitting && setIsStartModalOpen(false)}
        title="Iniciar evento manualmente?"
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <Typography variant="body2">
            Deseja iniciar o evento <strong>{event.name}</strong> agora?
          </Typography>
          <Alert severity="info" sx={{ borderRadius: "10px" }}>
            A data e hora de início será atualizada para o momento atual e o evento ficará liberado para fotos e telão
            ao vivo pelas próximas <strong>{durationHours} horas</strong>.
          </Alert>
          <Typography variant="caption" color="text.secondary">
            <strong>Atenção:</strong> a partir do momento em que o evento for iniciado, a data e hora de início não
            poderão mais ser alteradas.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setIsStartModalOpen(false)}
              disabled={isSubmitting}
              sx={modalButtonStyles}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <StartIcon fontSize="small" />}
              onClick={handleConfirmStart}
              disabled={isSubmitting}
              sx={{
                ...modalButtonStyles,
                bgcolor: brandColors.flashYellow,
                color: brandColors.ink,
                "&:hover": { bgcolor: "#F5C30A" }
              }}
            >
              {isSubmitting ? "Iniciando..." : "Iniciar agora"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={isCloseModalOpen}
        onClose={() => !isSubmitting && setIsCloseModalOpen(false)}
        title="Encerrar evento?"
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <Typography variant="body2">
            Tem certeza de que deseja encerrar o evento <strong>{event.name}</strong>?
          </Typography>
          <Alert severity="warning" sx={{ borderRadius: "10px" }}>
            Ao encerrar o evento:
            <Box component="ul" sx={{ pl: 2.5, m: 0, mt: 0.5 }}>
              <li>
                Os convidados <strong>não poderão mais enviar fotos</strong>.
              </li>
              <li>
                A <strong>galeria completa de fotos será liberada</strong> para visualização.
              </li>
              <li>
                Você poderá reabri-lo a qualquer momento dentro do limite de <strong>{durationHours} horas</strong> do
                evento.
              </li>
            </Box>
          </Alert>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setIsCloseModalOpen(false)}
              disabled={isSubmitting}
              sx={modalButtonStyles}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <CloseIcon fontSize="small" />}
              onClick={handleConfirmClose}
              disabled={isSubmitting}
              sx={modalButtonStyles}
            >
              {isSubmitting ? "Encerrando..." : "Confirmar encerramento"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={isReopenModalOpen}
        onClose={() => !isSubmitting && setIsReopenModalOpen(false)}
        title="Reabrir evento?"
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <Typography variant="body2">
            Deseja reabrir o evento <strong>{event.name}</strong>?
          </Typography>
          <Alert severity="success" sx={{ borderRadius: "10px" }}>
            O evento será reativado e o envio de fotos voltará a ficar disponível para os convidados até o término das{" "}
            <strong>{durationHours} horas</strong> do evento
            {remaining ? ` (restam aproximadamente ${remaining.hours}h ${remaining.minutes}min)` : ""}.
          </Alert>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setIsReopenModalOpen(false)}
              disabled={isSubmitting}
              sx={modalButtonStyles}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={
                isSubmitting ? <CircularProgress size={16} color="inherit" /> : <ReopenIcon fontSize="small" />
              }
              onClick={handleConfirmReopen}
              disabled={isSubmitting}
              sx={modalButtonStyles}
            >
              {isSubmitting ? "Reabrindo..." : "Reabrir evento"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default EventStatusControl;
