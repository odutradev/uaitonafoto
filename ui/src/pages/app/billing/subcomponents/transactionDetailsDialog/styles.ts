import type { SxProps, Theme } from "@mui/material";

export const dialogPaperStyles: SxProps<Theme> = {
  borderRadius: "20px",
  maxWidth: 520,
  width: "calc(100% - 32px)",
  m: 2
};

export const metaStackStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
  pt: 1
};

export const metaRowStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: { xs: "flex-start", sm: "center" },
  justifyContent: "space-between",
  gap: 0.5,
  p: 1.5,
  borderRadius: "12px",
  bgcolor: "action.hover"
};

export const monoIdStyles: SxProps<Theme> = {
  fontFamily: "monospace",
  fontSize: "0.82rem",
  wordBreak: "break-all"
};

export const dialogActionsStyles: SxProps<Theme> = {
  px: 3,
  pb: 2.5,
  gap: 1,
  flexDirection: { xs: "column-reverse", sm: "row" }
};

export const dialogButtonStyles: SxProps<Theme> = {
  minHeight: 46,
  width: { xs: "100%", sm: "auto" }
};
