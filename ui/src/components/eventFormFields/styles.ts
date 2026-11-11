import type { SxProps, Theme } from "@mui/material";

export const formFieldsStackStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  pt: 0.5
};

export const twoColsRowStyles: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
  gap: 2
};

export const pinCardBoxStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
  p: 1.75,
  borderRadius: "12px",
  border: 1,
  borderColor: "divider",
  bgcolor: "action.hover"
};

export const pinToggleRowStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1.5
};
