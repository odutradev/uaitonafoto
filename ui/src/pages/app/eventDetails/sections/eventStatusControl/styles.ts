import { brandColors } from "@styles/theme";
import type { SxProps, Theme } from "@mui/material";

export const statusControlCardStyles: SxProps<Theme> = (theme) => ({
  p: { xs: 2, sm: 2.25 },
  borderRadius: "16px",
  bgcolor: theme.palette.mode === "dark" ? brandColors.darkPaper : "#FFFFFF",
  border: `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  alignItems: { xs: "flex-start", md: "center" },
  justifyContent: "space-between",
  gap: 2
});

export const statusInfoColumnStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
  minWidth: 0
};

export const statusHeaderRowStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 1
};

export const statusBadgeStyles: SxProps<Theme> = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.75,
  px: 1,
  py: 0.25,
  borderRadius: "6px",
  fontSize: "0.72rem",
  fontWeight: 700,
  border: "1px solid",
  borderColor: "divider",
  color: "text.secondary"
};

export const statusActionRowStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  flexShrink: 0,
  width: { xs: "100%", md: "auto" },
  justifyContent: { xs: "flex-start", md: "flex-end" }
};

export const statusActionButtonStyles: SxProps<Theme> = {
  minHeight: 36,
  px: 1.75,
  py: 0.75,
  fontSize: "0.8125rem",
  fontWeight: 700,
  borderRadius: "10px",
  borderWidth: "1px",
  "&:hover": {
    borderWidth: "1px"
  }
};

export const modalButtonStyles: SxProps<Theme> = {
  minHeight: 36,
  px: 2,
  py: 0.75,
  fontSize: "0.8125rem",
  fontWeight: 700,
  borderRadius: "10px",
  borderWidth: "1px",
  "&:hover": {
    borderWidth: "1px"
  }
};

export const liveDotStyles: SxProps<Theme> = {
  width: 6,
  height: 6,
  borderRadius: "50%",
  bgcolor: "#22c55e",
  boxShadow: "0 0 6px #22c55e",
  display: "inline-block"
};
