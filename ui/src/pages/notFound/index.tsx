import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import { Logo } from '@components/common/Logo'

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
        <Stack spacing={3} alignItems="center">
          <RouterLink to="/" style={{ textDecoration: 'none' }}>
            <Logo size="medium" />
          </RouterLink>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '5rem', sm: '7rem' },
              color: 'secondary.main',
              lineHeight: 1
            }}
          >
            404
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
            Essa página não está na foto.
          </Typography>
          <Button component={RouterLink} to="/" variant="contained" size="large">
            Voltar ao início
          </Button>
        </Stack>
      </Box>
    </Container>
  )
}

export default NotFound
