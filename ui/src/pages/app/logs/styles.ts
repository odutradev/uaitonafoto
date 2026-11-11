import type { SxProps, Theme } from "@mui/material";

export const logsPageStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: { xs: 3, sm: 4 },
  width: "100%"
};

export const headerRowStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: { xs: "stretch", sm: "center" },
  justifyContent: "space-between",
  gap: 2
};

export const pageTitleStyles: SxProps<Theme> = {
  fontSize: { xs: "1.75rem", sm: "2.25rem" }
};

export const refreshButtonStyles: SxProps<Theme> = {
  minHeight: 48,
  width: { xs: "100%", sm: "auto" },
  flexShrink: 0
};
