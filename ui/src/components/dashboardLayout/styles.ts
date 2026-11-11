import type { SxProps, Theme } from "@mui/material";
import { brandColors } from "@styles/theme";

export const sidebarWidth = 272;

export const layoutRootStyles: SxProps<Theme> = {
  height: "100dvh",
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  bgcolor: "background.default",
  width: "100%",
  maxWidth: "100%",
  overflow: "hidden"
};

export const getMobileTopBarStyles = (isDark: boolean): SxProps<Theme> => ({
  display: { xs: "flex", md: "none" },
  alignItems: "center",
  justifyContent: "space-between",
  px: 2,
  py: 1,
  minHeight: 64,
  flexShrink: 0,
  zIndex: 20,
  borderBottom: 1,
  borderColor: "divider",
  bgcolor: isDark ? "rgba(18, 16, 12, 0.9)" : "rgba(251, 248, 241, 0.9)",
  backdropFilter: "blur(10px)",
  width: "100%"
});

export const mobileMenuButtonStyles: SxProps<Theme> = {
  width: 48,
  height: 48,
  borderRadius: "14px",
  color: "text.primary"
};

export const mobileBrandLinkStyles: SxProps<Theme> = {
  display: "inline-flex",
  alignItems: "center",
  textDecoration: "none",
  minWidth: 0
};

export const getDesktopSidebarStyles = (isDark: boolean): SxProps<Theme> => ({
  display: { xs: "none", md: "flex" },
  flexDirection: "column",
  width: sidebarWidth,
  flexShrink: 0,
  height: "100%",
  borderRight: 1,
  borderColor: "divider",
  bgcolor: isDark ? brandColors.darkPaper : "#FFFFFF"
});

export const getMobileDrawerPaperStyles = (isDark: boolean): SxProps<Theme> => ({
  width: sidebarWidth,
  maxWidth: "86vw",
  borderRadius: 0,
  border: "none",
  borderRight: `1px solid ${isDark ? brandColors.darkBorder : brandColors.lightBorder}`,
  bgcolor: isDark ? brandColors.darkPaper : "#FFFFFF",
  backgroundImage: "none"
});

export const sidebarInnerStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  p: 2.5,
  gap: 2.5,
  overflowY: "auto",
  overflowX: "hidden"
};

export const sidebarHeaderStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
  minHeight: 44
};

export const getCreditsBannerStyles = (isDark: boolean): SxProps<Theme> => ({
  p: 2,
  borderRadius: "16px",
  cursor: "pointer",
  border: `1px solid ${isDark ? brandColors.darkBorder : brandColors.lightBorder}`,
  bgcolor: isDark ? brandColors.darkSurface : brandColors.paper,
  transition: "transform 0.15s ease, border-color 0.15s ease",
  "&:hover": {
    borderColor: brandColors.flashYellow,
    transform: "translateY(-1px)"
  }
});

export const creditsLabelRowStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
  mb: 0.75
};

export const creditsValueRowStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "baseline",
  flexWrap: "wrap",
  gap: 0.75
};

export const navListStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 0.75,
  flex: 1
};

export const getNavButtonStyles = (isActive: boolean, isDark: boolean): SxProps<Theme> => ({
  justifyContent: "flex-start",
  minHeight: 48,
  px: 2,
  py: 1.25,
  borderRadius: "14px",
  gap: 1.5,
  fontWeight: isActive ? 800 : 600,
  fontSize: "0.95rem",
  color: isActive ? brandColors.ink : isDark ? brandColors.darkTextSecondary : brandColors.textGray,
  bgcolor: isActive ? brandColors.flashYellow : "transparent",
  "&:hover": {
    bgcolor: isActive ? "#F5C30A" : isDark ? "rgba(255, 207, 31, 0.08)" : "rgba(23, 20, 15, 0.05)",
    color: isActive ? brandColors.ink : "text.primary"
  }
});

export const sidebarFooterStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
  pt: 1.5,
  borderTop: 1,
  borderColor: "divider"
};

export const getUserSummaryRowStyles = (isActive: boolean, isDark: boolean): SxProps<Theme> => ({
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  minWidth: 0,
  px: 1.5,
  py: 1,
  borderRadius: "14px",
  cursor: "pointer",
  border: `1px solid ${isActive ? brandColors.flashYellow : "transparent"}`,
  bgcolor: isActive ? (isDark ? "rgba(255, 207, 31, 0.12)" : "rgba(255, 207, 31, 0.2)") : "transparent",
  transition: "background-color 0.15s ease, border-color 0.15s ease",
  "&:hover": {
    bgcolor: isActive
      ? isDark
        ? "rgba(255, 207, 31, 0.18)"
        : "rgba(255, 207, 31, 0.28)"
      : isDark
        ? "rgba(255, 207, 31, 0.08)"
        : "rgba(23, 20, 15, 0.05)"
  }
});

export const userAvatarStyles: SxProps<Theme> = {
  width: 40,
  height: 40,
  bgcolor: "primary.main",
  color: "primary.contrastText",
  fontWeight: 800,
  flexShrink: 0
};

export const userTextBoxStyles: SxProps<Theme> = {
  minWidth: 0,
  flex: 1
};

export const ellipsisTextStyles: SxProps<Theme> = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
};

export const adminBadgeStyles: SxProps<Theme> = {
  height: 20,
  fontSize: "0.68rem",
  fontWeight: 800,
  flexShrink: 0
};

export const logoutButtonStyles: SxProps<Theme> = {
  justifyContent: "flex-start",
  minHeight: 48,
  px: 2,
  borderRadius: "14px",
  color: "error.main",
  fontWeight: 700,
  gap: 1.5,
  "&:hover": {
    bgcolor: "rgba(211, 47, 47, 0.08)"
  }
};

export const mainAreaStyles: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
  overflowX: "hidden"
};

export const mainContainerStyles: SxProps<Theme> = {
  flex: "1 0 auto",
  display: "flex",
  flexDirection: "column",
  gap: { xs: 3.5, sm: 4.5 },
  px: { xs: 2, sm: 3, md: 4 },
  py: { xs: 3, sm: 4, md: 5 },
  width: "100%"
};
