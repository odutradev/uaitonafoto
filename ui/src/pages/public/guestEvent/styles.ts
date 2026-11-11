import type { SxProps, Theme } from "@mui/material";

export const pageRootStyles: SxProps<Theme> = {
  minHeight: "100vh",
  py: { xs: 3, sm: 5 }
};

export const containerStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 3
};

export const topBarStyles: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between"
};

export const headerStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 1
};

export const titleStyles: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: { xs: "1.5rem", sm: "2rem" },
  overflowWrap: "anywhere"
};

export const chipsStyles: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: 1
};

export const guestAgencyCardStyles: SxProps<Theme> = (theme) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1.5,
  p: 1.5,
  borderRadius: "16px",
  bgcolor: theme.palette.mode === "dark" ? "rgba(255, 184, 0, 0.05)" : "rgba(255, 184, 0, 0.08)",
  border: "1px solid",
  borderColor: theme.palette.mode === "dark" ? "rgba(255, 184, 0, 0.25)" : "rgba(255, 184, 0, 0.35)",
  backdropFilter: "blur(8px)"
});

export const guestWhatsappButtonStyles: SxProps<Theme> = {
  borderRadius: "9999px",
  bgcolor: "#25D366",
  color: "#fff",
  fontWeight: 700,
  fontSize: "0.75rem",
  textTransform: "none",
  boxShadow: "none",
  px: 1.75,
  py: 0.5,
  flexShrink: 0,
  "&:hover": {
    bgcolor: "#20ba5a",
    boxShadow: "none"
  }
};
