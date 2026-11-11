import type { SxProps, Theme } from "@mui/material";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
  disabled?: boolean;
  isLoading?: boolean;
  hideOnSinglePage?: boolean;
  size?: "small" | "medium" | "large";
  totalItems?: number;
  showSummary?: boolean;
  summaryText?: string;
  siblingCount?: number;
  boundaryCount?: number;
  sx?: SxProps<Theme>;
}
