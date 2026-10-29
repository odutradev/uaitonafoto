import { IconButton, Tooltip } from '@mui/material'
import { DarkMode as DarkModeIcon, LightMode as LightModeIcon } from '@mui/icons-material'

import useSystemStore from '@stores/system'

import { getThemeToggleButtonStyles, themeToggleIconStyles } from './styles'
import type { ThemeToggleProps } from './types'

const ThemeToggle = ({
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
      sx={[
        getThemeToggleButtonStyles(isDark),
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
      {...rest}
    >
      {isDark ? <LightModeIcon sx={themeToggleIconStyles} /> : <DarkModeIcon sx={themeToggleIconStyles} />}
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
