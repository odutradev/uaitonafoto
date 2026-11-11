import { Box, Button, Card, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { FilterAltOff as ClearIcon, Search as SearchIcon } from "@mui/icons-material";

import { clearButtonStyles, clearRowStyles, filterCardStyles, getFilterGridStyles } from "./styles";
import type { LogScope } from "@utils/types/logs";
import type { LogCategoryFilter, LogLevelFilter } from "@pages/app/logs/types";
import useLogsPage from "@pages/app/logs/hook";

const LogsFilters = () => {
  const {
    isAdmin,
    searchInput,
    levelFilter,
    categoryFilter,
    scope,
    hasActiveFilters,
    setSearchInput: onSearchChange,
    handleLevelChange: onLevelChange,
    handleCategoryChange: onCategoryChange,
    handleScopeChange: onScopeChange,
    handleClearFilters: onClearFilters
  } = useLogsPage();

  return (
    <Card component="section" elevation={0} sx={filterCardStyles}>
      <Box sx={getFilterGridStyles(isAdmin)}>
        <TextField
          size="small"
          placeholder="Buscar por título, ação ou descrição..."
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              )
            }
          }}
          fullWidth
        />

        <FormControl size="small" fullWidth>
          <InputLabel id="log-level-filter-label">Severidade</InputLabel>
          <Select
            labelId="log-level-filter-label"
            label="Severidade"
            value={levelFilter}
            onChange={(e) => onLevelChange(e.target.value as LogLevelFilter)}
          >
            <MenuItem value="ALL">Todas</MenuItem>
            <MenuItem value="info">Informação</MenuItem>
            <MenuItem value="warn">Alerta</MenuItem>
            <MenuItem value="error">Erro</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" fullWidth>
          <InputLabel id="log-category-filter-label">Categoria</InputLabel>
          <Select
            labelId="log-category-filter-label"
            label="Categoria"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value as LogCategoryFilter)}
          >
            <MenuItem value="ALL">Todas</MenuItem>
            <MenuItem value="user">Conta e usuário</MenuItem>
            <MenuItem value="system">Sistema e pagamentos</MenuItem>
            {isAdmin && <MenuItem value="admin">Administração</MenuItem>}
          </Select>
        </FormControl>

        {isAdmin && (
          <FormControl size="small" fullWidth>
            <InputLabel id="log-scope-filter-label">Escopo</InputLabel>
            <Select
              labelId="log-scope-filter-label"
              label="Escopo"
              value={scope}
              onChange={(e) => onScopeChange(e.target.value as LogScope)}
            >
              <MenuItem value="all">Auditoria global</MenuItem>
              <MenuItem value="me">Apenas minha conta</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>

      {hasActiveFilters && (
        <Box sx={clearRowStyles}>
          <Button size="small" variant="text" startIcon={<ClearIcon />} onClick={onClearFilters} sx={clearButtonStyles}>
            Limpar filtros
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default LogsFilters;
