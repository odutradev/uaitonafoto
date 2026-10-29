import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const NotFound = () => {
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
          <Typography variant="h3" component="h1" fontWeight={700}>
            404
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Página não encontrada no uai to na foto.
          </Typography>
          <Button component={RouterLink} to="/" variant="contained">
            Voltar ao início
          </Button>
        </Stack>
      </Box>
    </Container>
  )
}

export default NotFound
