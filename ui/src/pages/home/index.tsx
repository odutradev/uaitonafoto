import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const Home = () => {
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
        <Stack spacing={3} alignItems="center">
          <Typography variant="h3" component="h1" fontWeight={700}>
            uai to na foto
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Compartilhamento e exibição de fotos ao vivo para eventos.
          </Typography>
          <Button component={RouterLink} to="/login" variant="contained" size="large">
            Entrar
          </Button>
        </Stack>
      </Box>
    </Container>
  )
}

export default Home
