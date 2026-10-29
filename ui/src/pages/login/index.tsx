import { Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import useAuth from '@hooks/useAuth'
import { Logo } from '@components/common/Logo'

import type { FormEvent } from 'react'

const Login = () => {
  const { loginWithEmail, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email || !password) return

    setSubmitting(true)
    try {
      await loginWithEmail({ email, password })
      navigate('/')
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setSubmitting(true)
    try {
      await loginWithGoogle()
      navigate('/')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 6 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, width: '100%', bgcolor: '#FFFFFF' }}>
          <Stack component="form" onSubmit={handleSubmit} spacing={2.5} alignItems="center">
            <RouterLink to="/" style={{ textDecoration: 'none' }}>
              <Logo size="medium" sx={{ mb: 1 }} />
            </RouterLink>

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
              sx={{ height: 48 }}
            >
              Entrar
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={handleGoogleLogin}
              disabled={submitting}
              fullWidth
              size="large"
              sx={{ height: 48 }}
            >
              Continuar com Google
            </Button>
            <Button
              component={RouterLink}
              to="/"
              variant="text"
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              Voltar ao início
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  )
}

export default Login
