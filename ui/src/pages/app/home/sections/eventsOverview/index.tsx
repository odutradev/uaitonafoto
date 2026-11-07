import { Box, Button, Card, Typography } from '@mui/material'
import {
  ConfirmationNumberOutlined as CreditsIcon,
  QrCode2Outlined as QrIcon,
  TvOutlined as LiveWallIcon
} from '@mui/icons-material'

import {
  cardTopRowStyles,
  infoCardStyles,
  linkButtonStyles,
  metricValueStyles,
  overviewGridStyles
} from './styles'
import type { EventsOverviewProps } from './types'

const EventsOverview = ({
  paidCredits,
  freeCredits,
  freeTrialClaimed,
  onGoToBilling
}: EventsOverviewProps) => {
  const totalAvailable = paidCredits + freeCredits

  return (
    <Box component="section" sx={overviewGridStyles}>
      <Card elevation={0} sx={infoCardStyles}>
        <Box sx={cardTopRowStyles}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            CRÉDITOS PRONTOS PARA USO
          </Typography>
          <CreditsIcon color="primary" fontSize="small" />
        </Box>

        <Box>
          <Typography variant="h4" component="p" sx={metricValueStyles}>
            {totalAvailable} {totalAvailable === 1 ? 'disponível' : 'disponíveis'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {paidCredits} {paidCredits === 1 ? 'passe completo' : 'passes completos'} e {freeCredits} de degustação.
          </Typography>
        </Box>

        <Button variant="outlined" size="small" onClick={onGoToBilling} sx={linkButtonStyles}>
          {totalAvailable === 0 && !freeTrialClaimed ? 'Resgatar crédito grátis' : 'Comprar mais créditos'}
        </Button>
      </Card>

      <Card elevation={0} sx={infoCardStyles}>
        <Box sx={cardTopRowStyles}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            ACESSO ZERO FRICÇÃO
          </Typography>
          <QrIcon color="action" fontSize="small" />
        </Box>

        <Box>
          <Typography variant="h6" component="p" fontWeight={800}>
            QR Code + Mural Mobile
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Seus convidados escaneiam na mesa e publicam fotos em segundos, sem instalar aplicativo nem criar cadastro.
          </Typography>
        </Box>
      </Card>

      <Card elevation={0} sx={infoCardStyles}>
        <Box sx={cardTopRowStyles}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            TELÃO EM TEMPO REAL
          </Typography>
          <LiveWallIcon color="action" fontSize="small" />
        </Box>

        <Box>
          <Typography variant="h6" component="p" fontWeight={800}>
            Live Wall 16:9 + Moderação
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Exiba cada nova foto em destaque na TV ou projetor com controle de aprovação automática ou via PIN da equipe.
          </Typography>
        </Box>
      </Card>
    </Box>
  )
}

export default EventsOverview
