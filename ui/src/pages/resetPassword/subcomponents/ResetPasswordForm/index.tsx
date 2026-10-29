import { Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import { Logo, ThemeToggle } from '@components/index'

import {
  backButtonStyles,
  cardStyles,
  resetWrapperStyles,
  submitButtonStyles,
  themeToggleStyles,
  titleStyles
} from './styles'
import type { ResetPasswordFormProps } from './types'

export const ResetPasswordForm = ({
  token,
  email,
  setEmail,
  password,
  setPassword,
  submitting,
  submitted,
  onSubmit
}: ResetPasswordFormProps) => {
  return (
    <Container maxWidth="xs">
      <Box sx={resetWrapperStyles}>
        <Box sx={themeToggleStyles}>
          <ThemeToggle />
        </Box>

        <Paper elevation={0} sx={cardStyles}>
          <Stack component="form" onSubmit={onSubmit} spacing={2.5} alignItems="center">
            <RouterLink to="/" style={{ textDecoration: 'none' }}>
              <Logo size="medium" sx={{ mb: 1 }} />
            </RouterLink>

            <Typography variant="h5" component="h1" sx={titleStyles}>
              redefinir senha
            </Typography>

            {token ? (
              <TextField
                label="Nova senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
            ) : (
              <TextField
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
            )}

            {submitted && !token && (
              <Typography variant="body2" color="success.main" textAlign="center">
                Se o e-mail estiver cadastrado, você receberá um link de recuperação.
              </Typography>
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
              {token ? 'Salvar nova senha' : 'Enviar link de recuperação'}
            </Button>

            <Button
              component={RouterLink}
              to="/login"
              variant="text"
              size="small"
              sx={backButtonStyles}
            >
              Voltar ao login
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  )
}

export default ResetPasswordForm

