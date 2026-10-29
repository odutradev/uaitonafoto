import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import useAuth from '@hooks/useAuth'
import { Logo, ThemeToggle } from '@components/index'

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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 6,
        bgcolor: 'background.default'
      }}
    >
      <Box sx={{ position: 'fixed', top: 20, right: 20 }}>
        <ThemeToggle />
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, width: '100%', maxWidth: 420 }}>
        <Stack component="form" onSubmit={handleSubmit} spacing={2.5} alignItems="stretch">
          <Box component={RouterLink} to="/" sx={{ display: 'flex', justifyContent: 'center' }}>
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
            sx={{ height: 48, fontWeight: 800 }}
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
            sx={{ height: 48, fontWeight: 700 }}
          >
            Continuar com Google
          </Button>
          <Button
            component={RouterLink}
            to="/"
            variant="text"
            size="small"
            sx={{ color: 'text.secondary', alignSelf: 'center' }}
          >
            Voltar ao início
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}

export default Login
