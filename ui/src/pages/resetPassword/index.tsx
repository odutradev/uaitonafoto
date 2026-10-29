import { Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { confirmPasswordReset, requestPasswordReset } from '@services/auth/passwordReset'
import useQueryParams from '@hooks/useQueryParams'
import { Logo, ThemeToggle } from '@components/index'

import type { FormEvent } from 'react'

const ResetPassword = () => {
  const { token } = useQueryParams<{ token?: string }>()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      if (token) {
        await confirmPasswordReset({ token, password })
        navigate('/login')
        return
      }

      await requestPasswordReset({ email })
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 6, position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 20, right: 0 }}>
          <ThemeToggle />
        </Box>

        <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, width: '100%', bgcolor: 'background.paper' }}>
          <Stack component="form" onSubmit={handleSubmit} spacing={2.5} alignItems="center">
            <RouterLink to="/" style={{ textDecoration: 'none' }}>
              <Logo size="medium" sx={{ mb: 1 }} />
            </RouterLink>

            <Typography variant="h5" component="h1" fontWeight={800} textAlign="center" color="text.primary">
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
              sx={{ height: 48, fontWeight: 800 }}
            >
              {token ? 'Salvar nova senha' : 'Enviar link de recuperação'}
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="text"
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              Voltar ao login
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  )
}

export default ResetPassword
