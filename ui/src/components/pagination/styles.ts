import type { SxProps, Theme } from "@mui/material";

export const paginationRootStyles: SxProps<Theme> = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: "center",
  justifyContent: "center",
  gap: 1.5,
  width: "100%",
  py: 1.5
};

export const paginationMuiStyles: SxProps<Theme> = {
  "& .MuiPaginationItem-root": {
    fontWeight: 700,
    borderRadius: "10px",
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: "rgba(255, 207, 31, 0.16)"
    },
    "&.Mui-selected": {
      fontWeight: 800,
      bgcolor: "primary.main",
      color: "primary.contrastText",
      boxShadow: "0 2px 8px rgba(255, 207, 31, 0.3)",
      "&:hover": {
        bgcolor: "primary.light"
      }
    }
  }
};

export const summaryTextStyles: SxProps<Theme> = {
  fontSize: "0.8125rem",
  color: "text.secondary",
  fontWeight: 500
};
