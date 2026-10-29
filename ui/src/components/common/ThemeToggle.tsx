import { IconButton, Tooltip } from '@mui/material'
import { DarkMode as DarkModeIcon, LightMode as LightModeIcon } from '@mui/icons-material'
import type { IconButtonProps } from '@mui/material'

import useSystemStore from '@stores/system'
import { brandColors } from '@theme/theme'

export interface ThemeToggleProps extends Omit<IconButtonProps, 'onClick'> {
  showTooltip?: boolean
}

export const ThemeToggle = ({
  showTooltip = true,
  sx,
  ...rest
}: ThemeToggleProps) => {
  const { themeMode } = useSystemStore((state) => state.system)
  const toggleTheme = useSystemStore((state) => state.toggleTheme)

  const isDark = themeMode === 'dark'
  const title = isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'

  const button = (
    <IconButton
      onClick={toggleTheme}
      aria-label={title}
      sx={{
        width: 42,
        height: 42,
        borderRadius: '50%',
        bgcolor: isDark ? 'rgba(255, 207, 31, 0.12)' : 'rgba(23, 20, 15, 0.06)',
        color: isDark ? brandColors.amareloFlash : brandColors.tinta,
        border: `1px solid ${isDark ? brandColors.darkBorder : brandColors.bordaClara}`,
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: isDark ? 'rgba(255, 207, 31, 0.22)' : 'rgba(23, 20, 15, 0.12)'
        },
        ...sx
      }}
      {...rest}
    >
      {isDark ? <LightModeIcon sx={{ fontSize: 20 }} /> : <DarkModeIcon sx={{ fontSize: 20 }} />}
    </IconButton>
  )

  if (!showTooltip) return button

  return (
    <Tooltip title={title} arrow>
      {button}
    </Tooltip>
  )
}

export default ThemeToggle
