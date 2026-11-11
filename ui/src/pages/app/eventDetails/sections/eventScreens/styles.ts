import type { SxProps, Theme } from "@mui/material";

export const screenSectionStackStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 2
};

export const screenCardStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 3 },
  borderRadius: "16px",
  display: "flex",
  flexDirection: "column",
  gap: 2.5
};

export const screenHeaderRowStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  alignItems: { xs: "flex-start", md: "center" },
  justifyContent: "space-between",
  gap: 1.5
};

export const screenHeaderActionsStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 1,
  width: { xs: "100%", md: "auto" }
};

export const screenActionButtonStyles: SxProps<Theme> = {
  minHeight: 36,
  px: 1.75,
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

export const countBadgeStyles: SxProps<Theme> = {
  px: 0.85,
  py: 0.2,
  borderRadius: "6px",
  fontSize: "0.72rem",
  fontWeight: 700,
  border: "1px solid",
  borderColor: "divider",
  color: "text.secondary"
};

export const linkFieldBoxStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
  px: 1.5,
  py: 0.75,
  borderRadius: "10px",
  bgcolor: "action.hover",
  border: 1,
  borderColor: "divider",
  minWidth: 0
};

export const linkTextStyles: SxProps<Theme> = {
  fontFamily: "monospace",
  fontSize: "0.8125rem",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  minWidth: 0,
  flex: 1
};

export const linkIconActionsStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 0.25,
  flexShrink: 0
};

export const compactIconButtonStyles: SxProps<Theme> = {
  p: 0.6,
  borderRadius: "8px",
  color: "text.secondary",
  "&:hover": {
    color: "text.primary",
    bgcolor: "action.selected"
  }
};

export const screenSlotsGridStyles: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    md: "repeat(2, minmax(0, 1fr))"
  },
  gap: 1.5
};

export const screenSlotCardStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 1.25,
  p: 2,
  borderRadius: "12px",
  bgcolor: "action.hover",
  border: 1,
  borderColor: "divider"
};

export const screenSlotHeaderStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1
};

export const statusPillStyles = (status: "online" | "offline" | "pending" | "blocked"): SxProps<Theme> => ({
  px: 0.85,
  py: 0.2,
  borderRadius: "6px",
  fontSize: "0.7rem",
  fontWeight: 700,
  border: "1px solid",
  ...(status === "online" && {
    bgcolor: "rgba(34, 197, 94, 0.12)",
    color: "#22c55e",
    borderColor: "rgba(34, 197, 94, 0.3)"
  }),
  ...(status === "offline" && {
    bgcolor: "rgba(245, 158, 11, 0.1)",
    color: "warning.main",
    borderColor: "rgba(245, 158, 11, 0.3)"
  }),
  ...(status === "pending" && {
    bgcolor: "transparent",
    color: "text.secondary",
    borderColor: "divider"
  }),
  ...(status === "blocked" && {
    bgcolor: "rgba(239, 68, 68, 0.12)",
    color: "error.main",
    borderColor: "rgba(239, 68, 68, 0.3)"
  })
});

export const pinCodeTextStyles: SxProps<Theme> = {
  fontFamily: "monospace",
  fontWeight: 800,
  fontSize: "1.35rem",
  letterSpacing: "0.2em",
  lineHeight: 1.2
};
