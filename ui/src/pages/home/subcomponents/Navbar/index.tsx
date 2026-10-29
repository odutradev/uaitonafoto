import { Box, Button, Container, Stack } from '@mui/material'
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

import { Logo, ThemeToggle } from '@components/index'

import { getHeaderStyles, loginButtonStyles, navContainerStyles } from './styles'
import type { NavbarProps } from './types'

export const Navbar = ({ data, isDark }: NavbarProps) => {
  return (
    <Box component="header" sx={getHeaderStyles(isDark)}>
      <Container maxWidth="lg" sx={navContainerStyles}>
        <RouterLink to="/" style={{ textDecoration: 'none' }}>
          <Logo size="medium" variant="auto" />
        </RouterLink>

        <Stack direction="row" spacing={1.5} alignItems="center">
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
