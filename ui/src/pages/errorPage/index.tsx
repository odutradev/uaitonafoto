import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { isRouteErrorResponse, Link as RouterLink, useRouteError } from 'react-router-dom'

const ErrorPage = () => {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Ocorreu um erro inesperado.'

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 6
        }}
      >
        <Stack spacing={2.5} alignItems="center">
          <Typography variant="h4" component="h1" fontWeight={700}>
            Ops! Algo deu errado
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
          <Button component={RouterLink} to="/" variant="contained">
            Voltar ao início
          </Button>
        </Stack>
      </Box>
    </Container>
  )
}

export default ErrorPage
