import type { SxProps, Theme } from "@mui/material";

export const dialogPaperStyles: SxProps<Theme> = {
  borderRadius: "20px",
  maxWidth: 580,
  width: "calc(100% - 32px)",
  m: 2
};

export const detailsStackStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
  pt: 1
};

export const infoRowStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: { xs: "flex-start", sm: "center" },
  justifyContent: "space-between",
  gap: 0.5,
  p: 1.5,
  borderRadius: "12px",
  bgcolor: "action.hover"
};

export const jsonPreStyles: SxProps<Theme> = {
  m: 0,
  p: 2,
  borderRadius: "12px",
  bgcolor: "action.hover",
  fontFamily: "monospace",
  fontSize: "0.8rem",
  overflowX: "auto",
  maxWidth: "100%"
};

export const dialogActionsStyles: SxProps<Theme> = {
  px: 3,
  pb: 2.5
};

export const closeBtnStyles: SxProps<Theme> = {
  minHeight: 46,
  width: { xs: "100%", sm: "auto" }
};
