import { Alert, Box, Button, Link, Paper, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import Logo from '@components/logo'
import ThemeToggle from '@components/themeToggle'

import {
  backButtonStyles,
  forgotPasswordBoxStyles,
  googleButtonStyles,
  loginCardStyles,
  loginWrapperStyles,
  logoWrapperStyles,
  registerLinkBoxStyles,
  submitButtonStyles,
  themeToggleWrapperStyles
} from './styles'
import type { LoginFormProps } from './types'

export const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  errorMessage,
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
        <Stack component="form" onSubmit={onSubmit} spacing={2} alignItems="stretch">
          <Box component={RouterLink} to="/" sx={logoWrapperStyles}>
            <Logo size="medium" />
          </Box>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Acesse sua conta para gerenciar eventos e telões
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ borderRadius: '12px' }}>
              {errorMessage}
            </Alert>
          )}

          <TextField
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            size="medium"
          />

          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            size="medium"
          />

          <Box sx={forgotPasswordBoxStyles}>
            <Link
              component={RouterLink}
              to="/reset-password"
              variant="caption"
              color="text.secondary"
              underline="hover"
            >
              Esqueceu a senha?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            fullWidth
            size="large"
            sx={submitButtonStyles}
          >
            {submitting ? 'Entrando...' : 'Entrar'}
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

          <Box sx={registerLinkBoxStyles}>
            <Typography variant="body2" color="text.secondary">
              Não tem uma conta?{' '}
              <Link
                component={RouterLink}
                to="/register"
                fontWeight={700}
                color="primary.dark"
                underline="hover"
              >
                Cadastre-se
              </Link>
            </Typography>
          </Box>

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
