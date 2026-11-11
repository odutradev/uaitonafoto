import type { SxProps, Theme } from "@mui/material";

export const settingsSectionStackStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 2
};

export const settingsCardStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 3 },
  borderRadius: "16px",
  display: "flex",
  flexDirection: "column",
  gap: 2.25
};

export const settingsActionsRowStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: { xs: "column-reverse", sm: "row" },
  justifyContent: "flex-end",
  gap: 1,
  pt: 0.5
};

export const settingsButtonStyles: SxProps<Theme> = {
  minHeight: 38,
  px: 2,
  py: 0.75,
  fontSize: "0.8125rem",
  fontWeight: 600,
  borderRadius: "10px",
  borderWidth: "1px",
  width: { xs: "100%", sm: "auto" },
  "&:hover": {
    borderWidth: "1px"
  }
};

export const syncButtonStyles: SxProps<Theme> = {
  minHeight: 32,
  px: 1.5,
  py: 0.5,
  fontSize: "0.78rem",
  fontWeight: 600,
  borderRadius: "8px",
  borderWidth: "1px",
  borderColor: "divider",
  color: "text.secondary",
  "&:hover": {
    borderWidth: "1px",
    color: "text.primary"
  }
};

export const proBadgeStyles: SxProps<Theme> = {
  px: 0.75,
  py: 0.15,
  borderRadius: "5px",
  fontSize: "0.65rem",
  fontWeight: 800,
  bgcolor: "primary.main",
  color: "primary.contrastText",
  lineHeight: 1.3
};

export const dangerCardStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 2.5 },
  borderRadius: "16px",
  borderColor: "error.light"
};

export const dangerRowStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: { xs: "stretch", sm: "center" },
  justifyContent: "space-between",
  gap: 2
};

export const customizationCardStyles: SxProps<Theme> = {
  p: 2,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  borderRadius: "12px",
  bgcolor: "action.hover",
  border: 1,
  borderColor: "divider"
};

export const customizationSwitchRowStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1.5,
  pt: 1.5,
  borderTop: 1,
  borderColor: "divider"
};

export const previewBoxStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 2.5 },
  borderRadius: "16px",
  bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.03)" : "#F9F7F1"),
  border: 1,
  borderColor: "divider",
  display: "flex",
  flexDirection: "column",
  gap: 2
};

export const previewTabsContainerStyles: SxProps<Theme> = {
  p: 0.5,
  borderRadius: "10px",
  bgcolor: "action.hover",
  border: 1,
  borderColor: "divider"
};

export const screenMockupStyles: SxProps<Theme> = {
  borderRadius: "14px",
  overflow: "hidden",
  border: "1.5px solid",
  borderColor: "divider",
  background: (theme) =>
    theme.palette.mode === "dark"
      ? "radial-gradient(circle at 50% 20%, #2A241C 0%, #16120D 100%)"
      : "radial-gradient(circle at 50% 20%, #3D352B 0%, #1E1914 100%)",
  color: "#FFFFFF",
  p: { xs: 2, sm: 2.5 },
  minHeight: 180,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 2,
  position: "relative",
  boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
};

export const screenHeaderBarStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
  fontSize: "0.75rem",
  color: "rgba(255, 255, 255, 0.7)"
};

export const screenBadgeStyles: SxProps<Theme> = {
  display: "inline-flex",
  alignItems: "center",
  gap: 1.25,
  p: "8px 16px",
  borderRadius: "999px",
  bgcolor: "rgba(255, 255, 255, 0.12)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.25)",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
  alignSelf: "flex-start"
};

export const appMockupStyles: SxProps<Theme> = {
  borderRadius: "16px",
  overflow: "hidden",
  border: "1.5px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
  boxShadow: (theme) => (theme.palette.mode === "dark" ? "0 6px 20px rgba(0,0,0,0.4)" : "0 4px 16px rgba(0,0,0,0.06)"),
  p: { xs: 2, sm: 2.5 },
  display: "flex",
  flexDirection: "column",
  gap: 1.75
};

export const appNotchBarStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "0.72rem",
  fontWeight: 700,
  color: "text.secondary",
  px: 0.5,
  pb: 0.5,
  borderBottom: "1px solid",
  borderColor: "divider"
};

export const appBadgeCardStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 1.5,
  p: 1.5,
  borderRadius: "12px",
  bgcolor: "action.hover",
  border: 1,
  borderColor: "divider"
};
