import type { SxProps, Theme } from "@mui/material";

export const filterCardStyles: SxProps<Theme> = {
  p: { xs: 2, sm: 2.5 },
  display: "flex",
  flexDirection: "column",
  gap: 2
};

export const getFilterGridStyles = (isAdmin: boolean): SxProps<Theme> => ({
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    sm: "repeat(2, minmax(0, 1fr))",
    md: isAdmin ? "minmax(220px, 1.5fr) repeat(3, minmax(0, 1fr))" : "minmax(220px, 1.8fr) repeat(2, minmax(0, 1fr))"
  },
  gap: 1.5
});

export const clearRowStyles: SxProps<Theme> = {
  display: "flex",
  justifyContent: "flex-end"
};

export const clearButtonStyles: SxProps<Theme> = {
  minHeight: 40,
  width: { xs: "100%", sm: "auto" }
};
