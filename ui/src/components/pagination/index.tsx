import { Box, Pagination as MuiPagination, Typography, useMediaQuery, useTheme } from "@mui/material";

import { paginationMuiStyles, paginationRootStyles, summaryTextStyles } from "./styles";
import type { PaginationProps } from "./types";

export const Pagination = ({
  page,
  totalPages,
  onPageChange,
  disabled = false,
  isLoading = false,
  hideOnSinglePage = false,
  size,
  totalItems,
  showSummary = false,
  summaryText,
  siblingCount,
  boundaryCount = 1,
  sx
}: PaginationProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (totalPages <= 0 || (hideOnSinglePage && totalPages <= 1)) {
    return null;
  }

  const effectiveDisabled = disabled || isLoading;
  const effectiveSize = size || (isMobile ? "small" : "medium");
  const effectiveSiblingCount = siblingCount ?? (isMobile ? 0 : 1);
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, page), safeTotalPages);

  const handleChange = (_event: React.ChangeEvent<unknown>, nextPage: number) => {
    if (nextPage !== page && !effectiveDisabled) {
      onPageChange(nextPage);
    }
  };

  return (
    <Box sx={[paginationRootStyles, ...(Array.isArray(sx) ? sx : [sx])]}>
      {showSummary && (
        <Typography variant="body2" sx={summaryTextStyles}>
          {summaryText ||
            (totalItems !== undefined
              ? `Página ${safeCurrentPage} de ${safeTotalPages} • Total de ${totalItems} ${totalItems === 1 ? "item" : "itens"}`
              : `Página ${safeCurrentPage} de ${safeTotalPages}`)}
        </Typography>
      )}

      <MuiPagination
        count={safeTotalPages}
        page={safeCurrentPage}
        disabled={effectiveDisabled}
        color="primary"
        shape="rounded"
        size={effectiveSize}
        siblingCount={effectiveSiblingCount}
        boundaryCount={boundaryCount}
        onChange={handleChange}
        sx={paginationMuiStyles}
      />
    </Box>
  );
};

export default Pagination;
