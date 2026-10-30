import { Alert, Box, Button, Link, Paper, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import Logo from '@components/logo'
import ThemeToggle from '@components/themeToggle'

import { useAuthForm } from './hooks/useAuthForm'
import {
  authCardStyles,
  authWrapperStyles,
  backButtonStyles,
  forgotPasswordBoxStyles,
  googleButtonStyles,
  logoWrapperStyles,
  submitButtonStyles,
  switchLinkBoxStyles,
  themeToggleWrapperStyles
} from './styles'
import type { AuthPageProps } from './types'

export const AuthPage = ({ initialMode }: AuthPageProps) => {
  const {
    isSignUp,
    toggleMode,
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
    handleSubmit,
    handleGoogleLogin
  } = useAuthForm({ initialMode })

  return (
    <Box sx={authWrapperStyles}>
      <Box sx={themeToggleWrapperStyles}>
        <ThemeToggle />
      </Box>

      <Paper elevation={0} sx={authCardStyles}>
        <Stack component="form" onSubmit={handleSubmit} spacing={2} alignItems="stretch">
          <Box
            component={RouterLink}
            to="/"
            sx={logoWrapperStyles}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Logo size="medium" />
          </Box>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            {isSignUp
              ? 'Crie sua conta para criar eventos e compartilhar fotos no telão'
              : 'Acesse sua conta para gerenciar eventos e telões'}
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ borderRadius: '12px' }}>
              {errorMessage}
            </Alert>
          )}

          {isSignUp && (
            <TextField
              label="Nome completo"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              size="medium"
            />
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
            helperText={isSignUp ? 'Mínimo de 6 caracteres' : undefined}
          />

          {isSignUp && (
            <TextField
              label="Confirmar senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              size="medium"
            />
          )}

          {!isSignUp && (
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
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            fullWidth
            size="large"
            sx={submitButtonStyles}
          >
            {submitting
              ? isSignUp
                ? 'Cadastrando...'
                : 'Entrando...'
              : isSignUp
                ? 'Criar conta'
                : 'Entrar'}
          </Button>

          <Button
            type="button"
            variant="outlined"
            onClick={handleGoogleLogin}
            disabled={submitting}
            fullWidth
            size="large"
            sx={googleButtonStyles}
          >
            Continuar com Google
          </Button>

          <Box sx={switchLinkBoxStyles}>
            <Typography variant="body2" color="text.secondary">
              {isSignUp ? 'Já tem uma conta? ' : 'Não tem uma conta? '}
              <Link
                component={RouterLink}
                to={isSignUp ? '/signin' : '/signup'}
                onClick={(e) => {
                  e.preventDefault()
                  toggleMode()
                }}
                fontWeight={700}
                color="primary.dark"
                underline="hover"
              >
                {isSignUp ? 'Entre' : 'Cadastre-se'}
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

export default AuthPage
