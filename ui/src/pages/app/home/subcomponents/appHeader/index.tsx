import { useState } from 'react'
import {
  Avatar,
  Box,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material'
import { Logout as LogoutIcon } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

import Logo from '@components/logo'
import ThemeToggle from '@components/themeToggle'

import {
  avatarButtonStyles,
  avatarStyles,
  getHeaderStyles,
  headerContainerStyles,
  logoutItemStyles,
  menuPaperStyles,
  menuTextEllipsisStyles,
  menuUserInfoStyles
} from './styles'
import type { MouseEvent } from 'react'
import type { AppHeaderProps } from './types'

export const AppHeader = ({ user, isDark, onLogout }: AppHeaderProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const isMenuOpen = Boolean(anchorEl)

  const openMenu = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const closeMenu = () => setAnchorEl(null)

  const handleLogout = () => {
    closeMenu()
    onLogout()
  }

  return (
    <Box component="header" sx={getHeaderStyles(isDark)}>
      <Container maxWidth="lg" sx={headerContainerStyles}>
        <RouterLink to="/app" style={{ textDecoration: 'none', display: 'inline-flex' }}>
          <Logo size="medium" variant="auto" />
        </RouterLink>

        <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }} alignItems="center" sx={{ flexShrink: 0 }}>
          <ThemeToggle />

          <IconButton
            onClick={openMenu}
            aria-label="Abrir menu do usuário"
            aria-controls={isMenuOpen ? 'user-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={isMenuOpen ? 'true' : undefined}
            sx={avatarButtonStyles}
          >
            <Avatar src={user.photoUrl} alt={user.name} sx={avatarStyles}>
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Stack>

        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={closeMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { sx: menuPaperStyles } }}
        >
          <Box sx={menuUserInfoStyles}>
            <Typography variant="subtitle2" fontWeight={700} sx={menuTextEllipsisStyles}>
              {user.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" component="p" sx={menuTextEllipsisStyles}>
              {user.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleLogout} sx={logoutItemStyles}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Sair
          </MenuItem>
        </Menu>
      </Container>
    </Box>
  )
}

export default AppHeader

