import type { SxProps, Theme } from "@mui/material";

export const feedSectionStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 2
};

export const feedGridStyles: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
  gap: 2
};

export const photoCardStyles: SxProps<Theme> = {
  position: "relative",
  overflow: "hidden",
  animation: "feedCardEntrance 0.4s ease-out",
  "@keyframes feedCardEntrance": {
    from: {
      opacity: 0,
      transform: "translateY(12px) scale(0.98)"
    },
    to: {
      opacity: 1,
      transform: "translateY(0) scale(1)"
    }
  }
};

export const challengeChipStyles: SxProps<Theme> = {
  position: "absolute",
  top: 8,
  left: 8,
  maxWidth: "calc(100% - 16px)",
  display: "inline-flex",
  alignItems: "center",
  gap: 0.5,
  px: 1,
  py: 0.4,
  borderRadius: "9999px",
  bgcolor: "rgba(0, 0, 0, 0.75)",
  backdropFilter: "blur(4px)",
  border: "1px solid rgba(255, 183, 77, 0.5)",
  color: "#ffb74d",
  fontSize: "0.75rem",
  fontWeight: 700,
  lineHeight: 1.2,
  zIndex: 2
};

export const photoImageStyles: SxProps<Theme> = {
  width: "100%",
  aspectRatio: "1 / 1",
  objectFit: "cover",
  display: "block",
  bgcolor: "action.hover"
};

export const photoBarStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
  px: 1.5,
  py: 1,
  minWidth: 0
};

export const guestNameStyles: SxProps<Theme> = {
  fontWeight: 600,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
};

export const actionsStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  flexShrink: 0
};
