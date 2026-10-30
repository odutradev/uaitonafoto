import { Box, Button, Paper, Typography } from '@mui/material'
import { PhotoCameraOutlined as PhotoCameraIcon } from '@mui/icons-material'

import {
  emptyButtonStyles,
  emptyDescriptionStyles,
  emptyIconStyles,
  emptyIconWrapperStyles,
  emptyStateStyles,
  sectionTitleStyles
} from './styles'
import type { EventsProps } from './types'

const Events = ({ onCreateEvent }: EventsProps) => {
  return (
    <Box component="section">
      <Typography variant="h5" component="h2" sx={sectionTitleStyles}>
        Meus eventos
      </Typography>

      <Paper elevation={0} sx={emptyStateStyles}>
        <Box sx={emptyIconWrapperStyles}>
          <PhotoCameraIcon sx={emptyIconStyles} />
        </Box>
        <Typography variant="h6" component="h3">
          Você ainda não tem eventos
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={emptyDescriptionStyles}>
          Crie seu primeiro evento, compartilhe o QR Code com os convidados e veja as fotos
          aparecerem no telão em tempo real.
        </Typography>
        <Button variant="outlined" size="large" onClick={onCreateEvent} sx={emptyButtonStyles}>
          Criar meu primeiro evento
        </Button>
      </Paper>
    </Box>
  )
}

export default Events
