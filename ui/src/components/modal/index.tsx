import { Box, Button, CircularProgress, Dialog, IconButton, Typography } from "@mui/material";
import {
  Close as CloseIcon,
  ErrorOutlineRounded as DangerIcon,
  InfoOutlined as InfoIcon,
  WarningAmberRounded as WarningIcon
} from "@mui/icons-material";

import {
  closeButtonStyles,
  getIconWrapperStyles,
  modalActionButtonStyles,
  modalActionsStyles,
  modalBackdropStyles,
  modalDescriptionStyles,
  modalPaperStyles,
  modalTitleStyles
} from "./styles";
import type { ModalProps, ModalVariant } from "./types";

const getDefaultIcon = (variant?: ModalVariant) => {
  switch (variant) {
    case "danger":
      return <DangerIcon />;
    case "warning":
      return <WarningIcon />;
    case "info":
      return <InfoIcon />;
    default:
      return null;
  }
};

export const Modal = ({
  open,
  onClose,
  title,
  description,
  icon,
  variant = "default",
  maxWidth = "xs",
  fullWidth = true,
  showCloseButton = true,
  primaryAction,
  secondaryAction,
  children,
  actions
}: ModalProps) => {
  const resolvedIcon = icon ?? getDefaultIcon(variant);
  const isPrimaryBusy = Boolean(primaryAction?.loading);

  const handleClose = () => {
    if (isPrimaryBusy) return;
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      slotProps={{
        backdrop: { sx: modalBackdropStyles },
        paper: { sx: modalPaperStyles, elevation: 0 }
      }}
    >
      {showCloseButton && (
        <IconButton
          aria-label="Fechar"
          onClick={handleClose}
          disabled={isPrimaryBusy}
          sx={closeButtonStyles}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}

      {resolvedIcon && <Box sx={getIconWrapperStyles(variant)}>{resolvedIcon}</Box>}

      {title && (
        <Typography variant="h6" component="h2" sx={modalTitleStyles}>
          {title}
        </Typography>
      )}

      {description && (
        <Typography variant="body2" component="div" sx={modalDescriptionStyles}>
          {description}
        </Typography>
      )}

      {children && <Box sx={{ mt: title || description ? 2 : 0 }}>{children}</Box>}

      {(actions || primaryAction || secondaryAction) && (
        <Box sx={modalActionsStyles}>
          {actions}

          {!actions && secondaryAction && (
            <Button
              variant="outlined"
              color="inherit"
              disabled={secondaryAction.disabled || isPrimaryBusy}
              onClick={secondaryAction.onClick}
              sx={modalActionButtonStyles}
            >
              {secondaryAction.label}
            </Button>
          )}

          {!actions && primaryAction && (
            <Button
              variant={primaryAction.variant ?? "contained"}
              color={primaryAction.color ?? (variant === "danger" ? "error" : "primary")}
              disabled={primaryAction.disabled || isPrimaryBusy}
              onClick={primaryAction.onClick}
              startIcon={isPrimaryBusy ? <CircularProgress size={16} color="inherit" /> : undefined}
              sx={modalActionButtonStyles}
            >
              {primaryAction.label}
            </Button>
          )}
        </Box>
      )}
    </Dialog>
  );
};

export default Modal;
