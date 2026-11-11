import type { SxProps, Theme } from "@mui/material";

export const pageWrapperStyles: SxProps<Theme> = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  bgcolor: "background.default",
  width: "100%",
  overflowX: "hidden"
};

export const headerBoxStyles: SxProps<Theme> = {
  py: 2,
  px: { xs: 2, sm: 4 },
  borderBottom: 1,
  borderColor: "divider",
  bgcolor: "background.paper",
  width: "100%"
};

export const headerContainerStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2
};

export const contentContainerStyles: SxProps<Theme> = {
  py: { xs: 4, sm: 6 },
  px: { xs: 2, sm: 3 },
  flexGrow: 1
};

export const contentPaperStyles: SxProps<Theme> = {
  p: { xs: 3, sm: 5 },
  borderRadius: { xs: 3, sm: 4 }
};

export const titleStyles: SxProps<Theme> = {
  fontFamily: "'Bricolage Grotesque', sans-serif",
  fontWeight: 800,
  fontSize: { xs: "1.75rem", sm: "2.25rem" },
  letterSpacing: "-0.03em",
  lineHeight: 1.15,
  mb: 1
};

export const subtitleStyles: SxProps<Theme> = {
  color: "text.secondary",
  mb: 4,
  fontSize: "0.875rem"
};

export const sectionTitleStyles: SxProps<Theme> = {
  fontFamily: "'Bricolage Grotesque', sans-serif",
  fontWeight: 700,
  fontSize: { xs: "1.15rem", sm: "1.25rem" },
  letterSpacing: "-0.02em",
  mt: 4,
  mb: 1.5,
  color: "text.primary"
};

export const paragraphStyles: SxProps<Theme> = {
  color: "text.secondary",
  lineHeight: 1.7,
  mb: 2,
  fontSize: { xs: "0.925rem", sm: "0.975rem" }
};

export const listStyles: SxProps<Theme> = {
  pl: 3,
  mb: 2,
  color: "text.secondary",
  fontSize: { xs: "0.925rem", sm: "0.975rem" },
  "& li": {
    mb: 1,
    lineHeight: 1.6
  }
};

export const cdcAlertBoxStyles: SxProps<Theme> = {
  p: { xs: 2.5, sm: 3 },
  borderRadius: 3,
  bgcolor: "rgba(255, 207, 31, 0.12)",
  border: "1.5px solid",
  borderColor: "primary.main",
  my: 3
};

export const stepBoxStyles: SxProps<Theme> = {
  p: 2.5,
  borderRadius: 3,
  bgcolor: "action.hover",
  border: 1,
  borderColor: "divider",
  my: 2
};

export const footerBoxStyles: SxProps<Theme> = {
  py: 3,
  borderTop: 1,
  borderColor: "divider",
  bgcolor: "background.paper",
  textAlign: "center",
  mt: "auto",
  width: "100%"
};
