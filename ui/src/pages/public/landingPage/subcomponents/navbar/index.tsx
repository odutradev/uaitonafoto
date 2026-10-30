import { Box, Button, Container, Stack } from '@mui/material'
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

import Logo from '@components/logo'
import ThemeToggle from '@components/themeToggle'

import { getHeaderStyles, loginButtonStyles, navContainerStyles } from './styles'
import type { NavbarProps } from './types'

export const Navbar = ({ data, isDark }: NavbarProps) => {
  return (
    <Box component="header" sx={getHeaderStyles(isDark)}>
      <Container maxWidth="lg" sx={navContainerStyles}>
        <RouterLink to="/" style={{ textDecoration: 'none', display: 'inline-flex' }}>
          <Logo size="medium" variant="auto" animation="breathe" />
        </RouterLink>

        <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }} alignItems="center" sx={{ flexShrink: 0 }}>
          <ThemeToggle />

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
        </Stack>
      </Container>
    </Box>
  )
}

export default Navbar
