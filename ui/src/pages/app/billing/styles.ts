import type { SxProps, Theme } from "@mui/material";

export const billingPageStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: { xs: 3, sm: 3.5 },
  width: "100%"
};

export const headerRowStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: { xs: "stretch", sm: "center" },
  justifyContent: "space-between",
  gap: 1.5
};

export const pageTitleStyles: SxProps<Theme> = {
  fontSize: { xs: "1.5rem", sm: "1.85rem" },
  mb: 0.25
};

export const headerButtonStyles: SxProps<Theme> = {
  minHeight: 40,
  px: 2,
  width: { xs: "100%", sm: "auto" },
  flexShrink: 0
};
