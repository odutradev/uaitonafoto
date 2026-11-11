import { brandColors } from "@styles/theme";
import type { SxProps, Theme } from "@mui/material";

export const modalDialogPaperStyles: SxProps<Theme> = (theme) => ({
  borderRadius: "28px",
  bgcolor: theme.palette.mode === "dark" ? brandColors.darkPaper : "#FFFFFF",
  color: "text.primary",
  maxWidth: { xs: "95vw", sm: 760, md: 840 },
  width: "100%",
  maxHeight: "88vh",
  display: "flex",
  flexDirection: "column",
  m: { xs: 1.5, sm: 2 },
  p: { xs: 2.5, sm: 3.5 },
  position: "relative",
  overflow: "hidden",
  boxShadow: theme.palette.mode === "dark" ? "0 24px 60px rgba(0, 0, 0, 0.75)" : "0 24px 60px rgba(0, 0, 0, 0.16)",
  border: `1px solid ${theme.palette.divider}`
});

export const modalBodyStyles: SxProps<Theme> = {
  flex: 1,
  overflowY: "auto",
  pr: 1,
  mr: -1,
  my: 1.5,
  "&::-webkit-scrollbar": {
    width: "6px"
  },
  "&::-webkit-scrollbar-thumb": {
    bgcolor: "rgba(255, 207, 31, 0.4)",
    borderRadius: "9999px"
  }
};

export const settingsSectionStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
  width: "100%"
};

export const settingsSectionTitleStyles: SxProps<Theme> = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.8rem",
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "text.secondary"
};

export const getLayoutCardStyles =
  (isSelected: boolean): SxProps<Theme> =>
  (theme) => ({
    p: 2,
    borderRadius: "18px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: isSelected ? `2px solid ${brandColors.flashYellow}` : `1px solid ${theme.palette.divider}`,
    bgcolor: isSelected
      ? theme.palette.mode === "dark"
        ? "rgba(255, 207, 31, 0.08)"
        : "rgba(255, 207, 31, 0.12)"
      : theme.palette.mode === "dark"
        ? brandColors.darkSurface
        : brandColors.sand,
    boxShadow: isSelected ? "0 0 16px rgba(255, 207, 31, 0.25)" : "none",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 1.5,
    height: "100%",
    boxSizing: "border-box",
    "&:hover": {
      borderColor: brandColors.flashYellow,
      transform: "translateY(-2px)"
    }
  });

export const settingRowStyles: SxProps<Theme> = (theme) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  p: 2,
  borderRadius: "18px",
  bgcolor: theme.palette.mode === "dark" ? brandColors.darkSurface : brandColors.sand,
  border: `1px solid ${theme.palette.divider}`,
  gap: 2,
  height: "100%",
  boxSizing: "border-box"
});
