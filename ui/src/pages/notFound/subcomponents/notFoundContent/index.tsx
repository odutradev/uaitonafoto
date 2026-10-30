import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import Logo from '@components/logo'

import { descriptionStyles, errorCodeStyles, notFoundWrapperStyles } from './styles'
import type { NotFoundContentProps } from './types'

export const NotFoundContent = ({
  title = '404',
  description = 'Essa página não está na foto.',
  homeHref = '/',
  buttonText = 'Voltar ao início'
}: NotFoundContentProps) => {
  return (
    <Container maxWidth="sm">
      <Box sx={notFoundWrapperStyles}>
        <Stack spacing={3} alignItems="center">
          <RouterLink to={homeHref} style={{ textDecoration: 'none' }}>
            <Logo size="medium" />
          </RouterLink>
          <Typography variant="h1" sx={errorCodeStyles}>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={descriptionStyles}>
            {description}
          </Typography>
          <Button component={RouterLink} to={homeHref} variant="contained" size="large">
            {buttonText}
          </Button>
        </Stack>
      </Box>
    </Container>
  )
}

export default NotFoundContent

