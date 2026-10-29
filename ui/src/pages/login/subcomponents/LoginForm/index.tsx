import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import { Logo, ThemeToggle } from '@components/index'

import {
  backButtonStyles,
  googleButtonStyles,
  loginCardStyles,
  loginWrapperStyles,
  logoWrapperStyles,
  submitButtonStyles,
  themeToggleWrapperStyles
} from './styles'
import type { LoginFormProps } from './types'

export const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  submitting,
  onSubmit,
  onGoogleLogin
}: LoginFormProps) => {
  return (
    <Box sx={loginWrapperStyles}>
      <Box sx={themeToggleWrapperStyles}>
        <ThemeToggle />
      </Box>

      <Paper elevation={0} sx={loginCardStyles}>
        <Stack component="form" onSubmit={onSubmit} spacing={2.5} alignItems="stretch">
          <Box component={RouterLink} to="/" sx={logoWrapperStyles}>
            <Logo size="medium" />
          </Box>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Acesse sua conta para gerenciar eventos e telões
          </Typography>

          <TextField
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            fullWidth
            size="large"
            sx={submitButtonStyles}
          >
            Entrar
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={onGoogleLogin}
            disabled={submitting}
            fullWidth
            size="large"
            sx={googleButtonStyles}
          >
            Continuar com Google
          </Button>
          <Button
            component={RouterLink}
            to="/"
            variant="text"
            size="small"
            sx={backButtonStyles}
          >
            Voltar ao início
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}

export default LoginForm

