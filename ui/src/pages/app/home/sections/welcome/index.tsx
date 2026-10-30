import { Box, Button, Typography } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'

import { createEventButtonStyles, subtitleStyles, titleStyles, welcomeWrapperStyles } from './styles'
import type { WelcomeProps } from './types'

const Welcome = ({ firstName, onCreateEvent }: WelcomeProps) => {
  return (
    <Box component="section" sx={welcomeWrapperStyles}>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h3" component="h1" sx={titleStyles}>
          Olá, {firstName}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={subtitleStyles}>
          Gerencie seus eventos e acompanhe as fotos dos convidados em tempo real.
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<AddIcon />}
        onClick={onCreateEvent}
        sx={createEventButtonStyles}
      >
        Criar evento
      </Button>
    </Box>
  )
}

export default Welcome
