import { Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import useAuth from '@hooks/useAuth'

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
        <Paper elevation={2} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
          <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
            <Typography variant="h5" component="h1" fontWeight={700} textAlign="center">
              uai to na foto
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
            <Button type="submit" variant="contained" disabled={submitting} fullWidth>
              Entrar
            </Button>
            <Button type="button" variant="outlined" onClick={handleGoogleLogin} disabled={submitting} fullWidth>
              Continuar com Google
            </Button>
            <Button component={RouterLink} to="/" variant="text" size="small">
              Voltar ao início
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  )
}

export default Login

