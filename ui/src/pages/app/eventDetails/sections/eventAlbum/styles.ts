import type { SxProps, Theme } from "@mui/material";

export const albumCardStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 3 },
  borderRadius: "16px",
  display: "flex",
  flexDirection: "column",
  gap: 2.5
};

export const albumHeaderRowStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: { xs: "stretch", sm: "center" },
  justifyContent: "space-between",
  gap: 1.5
};

export const downloadZipButtonStyles: SxProps<Theme> = {
  minHeight: 38,
  px: 2,
  py: 0.75,
  fontSize: "0.8125rem",
  fontWeight: 700,
  borderRadius: "10px",
  whiteSpace: "nowrap"
};

export const stateBoxStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  gap: 0.75,
  py: { xs: 4, sm: 5 },
  px: 2,
  borderRadius: "14px",
  border: "1px dashed",
  borderColor: "divider",
  bgcolor: "action.hover"
};

export const stateIconWrapperStyles: SxProps<Theme> = {
  width: 42,
  height: 42,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "background.paper",
  border: 1,
  borderColor: "divider",
  color: "text.secondary",
  mb: 0.5
};

export const photosGridStyles: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "repeat(2, minmax(0, 1fr))",
    sm: "repeat(3, minmax(0, 1fr))",
    md: "repeat(4, minmax(0, 1fr))",
    lg: "repeat(5, minmax(0, 1fr))"
  },
  gap: 1.5
};

export const photoCardStyles: SxProps<Theme> = {
  position: "relative",
  borderRadius: "14px",
  overflow: "hidden",
  aspectRatio: "1 / 1",
  bgcolor: "action.hover",
  border: 1,
  borderColor: "divider",
  transition: "transform 0.15s ease, box-shadow 0.15s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.18)"
  }
};

export const photoImageStyles: SxProps<Theme> = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block"
};

export const photoOverlayStyles: SxProps<Theme> = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 0.75,
  px: 1.25,
  py: 0.75,
  color: "#fff",
  background: "linear-gradient(transparent, rgba(0,0,0,0.85))"
};

export const photoOverlayNameStyles: SxProps<Theme> = {
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontWeight: 700,
  fontSize: "0.75rem"
};

export const deletePhotoButtonStyles: SxProps<Theme> = {
  color: "#fff",
  p: 0.5,
  "&:hover": {
    bgcolor: "rgba(255,255,255,0.2)"
  }
};

export const approvePhotoButtonStyles: SxProps<Theme> = {
  bgcolor: "success.main",
  color: "#fff",
  p: 0.5,
  "&:hover": {
    bgcolor: "success.dark"
  }
};

export const rejectPhotoButtonStyles: SxProps<Theme> = {
  bgcolor: "error.main",
  color: "#fff",
  p: 0.5,
  "&:hover": {
    bgcolor: "error.dark"
  }
};

export const moderationBarStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 1,
  pb: 0.5
};

export const moderationTabsStyles: SxProps<Theme> = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.5,
  flexWrap: "wrap",
  p: 0.5,
  borderRadius: "10px",
  bgcolor: "action.hover",
  border: 1,
  borderColor: "divider"
};

export const moderationFilterButtonStyles = (active: boolean): SxProps<Theme> => ({
  minHeight: 30,
  px: 1.25,
  py: 0.4,
  borderRadius: "7px",
  fontSize: "0.78rem",
  fontWeight: active ? 700 : 500,
  color: active ? "text.primary" : "text.secondary",
  bgcolor: active ? "background.paper" : "transparent",
  border: active ? 1 : 0,
  borderColor: "divider",
  "&:hover": {
    bgcolor: active ? "background.paper" : "action.selected"
  }
});

export const approveAllButtonStyles: SxProps<Theme> = {
  minHeight: 32,
  px: 1.5,
  py: 0.5,
  fontSize: "0.78rem",
  fontWeight: 600,
  borderRadius: "8px"
};

export const photoStatusBadgeStyles = (status: "pending" | "approved" | "rejected"): SxProps<Theme> => ({
  position: "absolute",
  top: 8,
  left: 8,
  zIndex: 2,
  fontWeight: 700,
  fontSize: "0.68rem",
  height: 20,
  px: 0.75,
  display: "inline-flex",
  alignItems: "center",
  borderRadius: "6px",
  color: "#fff",
  bgcolor: status === "pending" ? "warning.dark" : status === "approved" ? "success.dark" : "error.dark"
});

// Estilos específicos para quando o evento for encerrado
export const endedHeroCardStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 2.5 },
  borderRadius: "14px",
  bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 207, 31, 0.05)" : "rgba(255, 207, 31, 0.1)"),
  border: "1.5px solid",
  borderColor: "primary.main",
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  alignItems: { xs: "stretch", md: "center" },
  justifyContent: "space-between",
  gap: 2
};

export const endedHeroInfoStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: { xs: "flex-start", sm: "center" },
  gap: 2
};

export const endedHeroIconBoxStyles: SxProps<Theme> = {
  width: 48,
  height: 48,
  borderRadius: "12px",
  bgcolor: "primary.main",
  color: "primary.contrastText",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0
};

export const endedStatsRowStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  flexWrap: "wrap",
  mt: 0.75
};

export const endedStatItemStyles: SxProps<Theme> = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.5,
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "text.secondary"
};

export const endedDownloadBigButtonStyles: SxProps<Theme> = {
  minHeight: 44,
  px: 2.5,
  py: 1,
  fontSize: "0.9rem",
  fontWeight: 800,
  borderRadius: "12px",
  bgcolor: "primary.main",
  color: "primary.contrastText",
  boxShadow: "0 4px 14px rgba(255, 207, 31, 0.35)",
  whiteSpace: "nowrap",
  flexShrink: 0,
  "&:hover": {
    bgcolor: "primary.dark"
  }
};

export const photoDirectDownloadButtonStyles: SxProps<Theme> = {
  bgcolor: "rgba(0, 0, 0, 0.6)",
  color: "#fff",
  p: 0.6,
  borderRadius: "8px",
  backdropFilter: "blur(4px)",
  "&:hover": {
    bgcolor: "primary.main",
    color: "primary.contrastText"
  }
};
