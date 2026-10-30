import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import Logo from '@components/logo'

import { errorTitleStyles, errorWrapperStyles } from './styles'
import type { ErrorContentProps } from './types'

export const ErrorContent = ({
  title = 'ops! algo deu errado',
  message,
  homeHref = '/',
  buttonText = 'Voltar ao início'
}: ErrorContentProps) => {
  return (
    <Container maxWidth="sm">
      <Box sx={errorWrapperStyles}>
        <Stack spacing={3} alignItems="center">
          <RouterLink to={homeHref} style={{ textDecoration: 'none' }}>
            <Logo size="medium" />
          </RouterLink>
          <Typography variant="h3" component="h1" sx={errorTitleStyles}>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
          <Button component={RouterLink} to={homeHref} variant="contained" size="large">
            {buttonText}
          </Button>
        </Stack>
      </Box>
    </Container>
  )
}

export default ErrorContent

