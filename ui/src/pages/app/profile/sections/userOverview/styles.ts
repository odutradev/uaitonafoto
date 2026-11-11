import type { SxProps, Theme } from "@mui/material";

export const overviewCardStyles: SxProps<Theme> = {
  p: { xs: 2.5, sm: 3.5 },
  display: "flex",
  flexDirection: "column",
  gap: 3
};

export const identityRowStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: { xs: "flex-start", sm: "center" },
  justifyContent: "space-between",
  gap: 2.5
};

export const avatarIdentityGroupStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  minWidth: 0,
  width: "100%"
};

export const largeAvatarStyles: SxProps<Theme> = {
  width: { xs: 64, sm: 76 },
  height: { xs: 64, sm: 76 },
  fontSize: "1.75rem",
  fontWeight: 800,
  bgcolor: "primary.main",
  color: "primary.contrastText",
  flexShrink: 0
};

export const identityTextBoxStyles: SxProps<Theme> = {
  minWidth: 0,
  flex: 1
};

export const ellipsisStyles: SxProps<Theme> = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
};

export const badgesRowStyles: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: 1,
  mt: 1
};

export const metadataGridStyles: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    sm: "repeat(2, minmax(0, 1fr))",
    md: "repeat(4, minmax(0, 1fr))"
  },
  gap: 2,
  pt: 2.5,
  borderTop: 1,
  borderColor: "divider"
};

export const metaItemBoxStyles: SxProps<Theme> = {
  p: 2,
  borderRadius: "14px",
  bgcolor: "action.hover",
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: 0.5
};

export const idCopyRowStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
  minWidth: 0
};
