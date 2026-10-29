import { Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { confirmPasswordReset, requestPasswordReset } from '@services/auth/passwordReset'
import useQueryParams from '@hooks/useQueryParams'

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
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 6 }}>
        <Paper elevation={2} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
          <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
            <Typography variant="h5" component="h1" fontWeight={700} textAlign="center">
              Redefinir senha — uai to na foto
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
                Se o e-mail estiver cadastrado, enviaremos o link de redefinição.
              </Typography>
            )}
            <Button type="submit" variant="contained" disabled={submitting} fullWidth>
              {token ? 'Salvar nova senha' : 'Enviar link'}
            </Button>
            <Button component={RouterLink} to="/login" variant="text" size="small">
              Voltar ao login
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  )
}

export default ResetPassword
