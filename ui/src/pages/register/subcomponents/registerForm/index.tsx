import { Alert, Box, Button, Link, Paper, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import Logo from '@components/logo'
import ThemeToggle from '@components/themeToggle'

import {
  backButtonStyles,
  googleButtonStyles,
  loginLinkBoxStyles,
  logoWrapperStyles,
  registerCardStyles,
  registerWrapperStyles,
  submitButtonStyles,
  themeToggleWrapperStyles
} from './styles'
import type { RegisterFormProps } from './types'

export const RegisterForm = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  errorMessage,
  submitting,
  onSubmit,
  onGoogleLogin
}: RegisterFormProps) => {
  return (
    <Box sx={registerWrapperStyles}>
      <Box sx={themeToggleWrapperStyles}>
        <ThemeToggle />
      </Box>

      <Paper elevation={0} sx={registerCardStyles}>
        <Stack component="form" onSubmit={onSubmit} spacing={2} alignItems="stretch">
          <Box component={RouterLink} to="/" sx={logoWrapperStyles}>
            <Logo size="medium" />
          </Box>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Crie sua conta para criar eventos e compartilhar fotos no telão
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ borderRadius: '12px' }}>
              {errorMessage}
            </Alert>
          )}

          <TextField
            label="Nome completo"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            size="medium"
          />

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
            helperText="Mínimo de 6 caracteres"
          />

          <TextField
            label="Confirmar senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
            size="medium"
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
            {submitting ? 'Cadastrando...' : 'Criar conta'}
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

          <Box sx={loginLinkBoxStyles}>
            <Typography variant="body2" color="text.secondary">
              Já tem uma conta?{' '}
              <Link
                component={RouterLink}
                to="/login"
                fontWeight={700}
                color="primary.dark"
                underline="hover"
              >
                Entre
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

export default RegisterForm

