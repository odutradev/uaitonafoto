import { Avatar, Box, Button, Container, Stack, Typography } from '@mui/material'
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

import Logo from '@components/logo'
import ThemeToggle from '@components/themeToggle'

import {
  getHeaderStyles,
  getUserBadgeStyles,
  loginButtonStyles,
  navContainerStyles,
  userAvatarStyles,
  userGreetingStyles,
  userNameStyles,
  userTextContainerStyles
} from './styles'
import type { NavbarProps } from './types'

export const Navbar = ({ data, isDark, user }: NavbarProps) => {
  const displayName = user?.fullName || user?.name || user?.email?.split('@')[0] || 'Usuário'

  return (
    <Box component="header" sx={getHeaderStyles(isDark)}>
      <Container maxWidth="lg" sx={navContainerStyles}>
        <RouterLink to="/" style={{ textDecoration: 'none', display: 'inline-flex' }}>
          <Logo size="medium" variant="auto" animation="breathe" />
        </RouterLink>

        <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }} alignItems="center" sx={{ flexShrink: 0 }}>
          <ThemeToggle />

          {user ? (
            <Stack direction="row" spacing={{ xs: 1, sm: 1.25 }} alignItems="center">
              <Box
                component={RouterLink}
                to="/app"
                sx={getUserBadgeStyles(isDark)}
                title={`Conectado como ${displayName}. Acessar painel.`}
              >
                <Avatar src={user.photoUrl} alt={displayName} sx={userAvatarStyles}>
                  {displayName.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={userTextContainerStyles}>
                  <Typography variant="caption" sx={userGreetingStyles}>
                    Conectado
                  </Typography>
                  <Typography variant="body2" sx={userNameStyles}>
                    {displayName}
                  </Typography>
                </Box>
              </Box>

              <Button
                component={RouterLink}
                to="/app"
                variant="contained"
                color="primary"
                size="medium"
                endIcon={<ArrowForwardIcon />}
                sx={loginButtonStyles}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Acessar painel
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  Entrar
                </Box>
              </Button>
            </Stack>
          ) : (
            <Button
              component={RouterLink}
              to={data.loginButton.href}
              variant="contained"
              color="primary"
              size="medium"
              endIcon={<ArrowForwardIcon />}
              sx={loginButtonStyles}
            >
              {data.loginButton.text}
            </Button>
          )}
        </Stack>
      </Container>
    </Box>
  )
}

export default Navbar
