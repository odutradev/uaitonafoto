import { useState } from "react";
import { Box, Button, Card, CircularProgress, IconButton, Tooltip, Typography } from "@mui/material";
import {
  ContentCopyOutlined as CopyIcon,
  LockOpenOutlined as LockOpenIcon,
  LockOutlined as LockIcon,
  OpenInNewOutlined as OpenIcon,
  PrintOutlined as PrintIcon
} from "@mui/icons-material";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "react-toastify";

import { pinRotationLabels } from "@assets/data/events";
import { buildGuestLink } from "@utils/functions/events";

import { TableDisplayModal } from "./subcomponents/tableDisplayModal";

import {
  compactIconButtonStyles,
  linkFieldBoxStyles,
  linkIconActionsStyles,
  linkTextStyles,
  pinBannerStyles,
  pinCodeTextStyles,
  qrBoxStyles,
  shareButtonStyles,
  shareCardStyles,
  shareInfoColumnStyles,
  shareMainRowStyles,
  shareSectionStackStyles,
  unlockButtonStyles
} from "./styles";
import useEventDetailsPage from "@pages/app/eventDetails/hook";

const ShareLink = () => {
  const { event: eventValue, handleUnlockGuestLockouts: onUnlockLockouts } = useEventDetailsPage();
  const event = eventValue!;

  const link = buildGuestLink(event.guestToken);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isDisplayModalOpen, setIsDisplayModalOpen] = useState(false);

  const handleUnlock = async () => {
    if (!onUnlockLockouts) return;
    setIsUnlocking(true);
    try {
      await onUnlockLockouts();
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    toast.success("Link do convidado copiado!");
  };

  const handleCopyPin = async () => {
    await navigator.clipboard.writeText(event.settings.pin);
    toast.success("PIN dos convidados copiado!");
  };

  return (
    <Box sx={shareSectionStackStyles}>
      <Card elevation={0} sx={shareCardStyles}>
        <Box sx={shareMainRowStyles}>
          <Box sx={qrBoxStyles}>
            <QRCodeSVG value={link} size={132} />
            <Typography variant="caption" sx={{ color: "#5E584C", fontWeight: 600, fontSize: "0.7rem" }}>
              Escaneie para enviar
            </Typography>
          </Box>

          <Box sx={shareInfoColumnStyles}>
            <Box>
              <Typography variant="subtitle1" fontWeight={700} component="h2">
                Acesso dos convidados
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                Compartilhe este link ou QR Code com os convidados do evento para que eles enviem fotos sem precisar
                baixar app.
              </Typography>
            </Box>

            <Box sx={linkFieldBoxStyles}>
              <Typography variant="body2" sx={linkTextStyles} title={link}>
                {link}
              </Typography>
              <Box sx={linkIconActionsStyles}>
                <Tooltip title="Copiar link">
                  <IconButton size="small" onClick={handleCopy} aria-label="Copiar link" sx={compactIconButtonStyles}>
                    <CopyIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Abrir link do convidado">
                  <IconButton
                    size="small"
                    component="a"
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Abrir link do convidado"
                    sx={compactIconButtonStyles}
                  >
                    <OpenIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Button
              size="small"
              variant="outlined"
              startIcon={<PrintIcon sx={{ fontSize: 16 }} />}
              onClick={() => setIsDisplayModalOpen(true)}
              sx={shareButtonStyles}
            >
              Gerar displays de mesa
            </Button>
          </Box>
        </Box>

        {event.settings.pinEnabled && (
          <Box sx={pinBannerStyles}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <LockIcon sx={{ fontSize: 16, color: "primary.main" }} />
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  PIN DE ACESSO
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ·{" "}
                  {event.settings.pinRotate
                    ? `Rotativo (${pinRotationLabels[event.settings.pinRotationMinutes]})`
                    : "Fixo"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography sx={pinCodeTextStyles}>{event.settings.pin}</Typography>
                <Tooltip title="Copiar PIN">
                  <IconButton size="small" onClick={handleCopyPin} aria-label="Copiar PIN" sx={compactIconButtonStyles}>
                    <CopyIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Tooltip title="Desbloqueia convidados bloqueados por tentativas incorretas de PIN">
              <span>
                <Button
                  size="small"
                  variant="outlined"
                  color="inherit"
                  startIcon={
                    isUnlocking ? (
                      <CircularProgress size={13} color="inherit" />
                    ) : (
                      <LockOpenIcon sx={{ fontSize: 15 }} />
                    )
                  }
                  onClick={handleUnlock}
                  disabled={isUnlocking}
                  sx={unlockButtonStyles}
                >
                  Desbloquear acessos
                </Button>
              </span>
            </Tooltip>
          </Box>
        )}
      </Card>

      <TableDisplayModal
        open={isDisplayModalOpen}
        onClose={() => setIsDisplayModalOpen(false)}
        event={event}
        guestUrl={link}
      />
    </Box>
  );
};

export default ShareLink;
