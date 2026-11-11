import type { SxProps, Theme } from "@mui/material";

export const teamSectionStackStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 2
};

export const teamCardStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 3 },
  borderRadius: "16px",
  display: "flex",
  flexDirection: "column",
  gap: 2.5
};

export const membersListStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 1
};

export const memberRowStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  px: 1.75,
  py: 1.25,
  borderRadius: "10px",
  bgcolor: "action.hover",
  border: 1,
  borderColor: "divider",
  minWidth: 0
};

export const memberAvatarStyles: SxProps<Theme> = {
  width: 34,
  height: 34,
  fontWeight: 700,
  fontSize: "0.875rem",
  bgcolor: "primary.main",
  color: "primary.contrastText",
  flexShrink: 0
};

export const memberTextStyles: SxProps<Theme> = {
  minWidth: 0,
  flex: 1
};

export const roleBadgeStyles = (isCreator: boolean): SxProps<Theme> => ({
  px: 0.85,
  py: 0.2,
  borderRadius: "6px",
  fontSize: "0.7rem",
  fontWeight: 700,
  border: "1px solid",
  borderColor: isCreator ? "rgba(255, 207, 31, 0.35)" : "divider",
  color: isCreator ? "primary.main" : "text.secondary",
  bgcolor: isCreator ? "rgba(255, 207, 31, 0.08)" : "transparent",
  flexShrink: 0
});

export const ellipsisStyles: SxProps<Theme> = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
};

export const addOrganizerSectionStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 1.25,
  pt: 2,
  borderTop: 1,
  borderColor: "divider"
};

export const addOrganizerRowStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: { xs: "stretch", sm: "flex-start" },
  gap: 1
};

export const teamButtonStyles: SxProps<Theme> = {
  minHeight: 40,
  px: 2,
  py: 0.75,
  fontSize: "0.8125rem",
  fontWeight: 600,
  borderRadius: "10px",
  width: { xs: "100%", sm: "auto" },
  flexShrink: 0
};
