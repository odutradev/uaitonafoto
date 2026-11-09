import { Box, Typography } from '@mui/material'
import {
  CameraAltOutlined as CameraIcon,
  CloudUploadOutlined as UploadIcon,
  TvOutlined as TvIcon,
  LockOutlined as LockIcon,
  AutoAwesomeOutlined as SparkleIcon
} from '@mui/icons-material'
import { QRCodeSVG } from 'qrcode.react'

import { TEMPLATE_THEMES, cardContainerStyles } from './styles'
import type { TableDisplayCardProps, TableDisplayTemplateId } from '../types'

export const TableDisplayCard = ({
  event,
  guestUrl,
  config,
  scale = 1
}: TableDisplayCardProps) => {
  const theme = TEMPLATE_THEMES[config.template]
  const isPinActive = config.showPin && event.settings.pinEnabled && Boolean(event.settings.pin)
  const agencyOrCustom =
    config.customFooter?.trim() ||
    event.customization?.agencyName?.trim() ||
    'uaitonafoto.com'

  const baseWidth = 380
  const baseHeight = 540
  const qrPixelSize =
    config.qrSize === 'large' ? Math.round(165 * scale) : Math.round(140 * scale)

  return (
    <Box
      className="table-display-card"
      sx={{
        ...cardContainerStyles(theme),
        width: `${baseWidth * scale}px`,
        minHeight: `${baseHeight * scale}px`,
        p: `${28 * scale}px`,
        gap: `${14 * scale}px`,
        position: 'relative'
      }}
    >
      {/* Molduras decorativas opcionais */}
      {config.showFrame && (
        <>
          {config.template === 'wedding' && (
            <Box
              sx={{
                position: 'absolute',
                inset: `${10 * scale}px`,
                border: `1px solid ${theme.borderColor}`,
                borderRadius: `${12 * scale}px`,
                pointerEvents: 'none',
                opacity: 0.85
              }}
            />
          )}
          {config.template === 'rustic' && (
            <Box
              sx={{
                position: 'absolute',
                inset: `${10 * scale}px`,
                border: `1.5px dashed ${theme.borderColor}`,
                borderRadius: `${12 * scale}px`,
                pointerEvents: 'none',
                opacity: 0.9
              }}
            />
          )}
          {config.template === 'minimal' && (
            <Box
              sx={{
                position: 'absolute',
                inset: `${8 * scale}px`,
                border: `1px solid ${theme.borderColor}`,
                borderRadius: `${12 * scale}px`,
                pointerEvents: 'none',
                opacity: 0.7
              }}
            />
          )}
          {config.template === 'party' && (
            <Box
              sx={{
                position: 'absolute',
                inset: `${10 * scale}px`,
                border: `1px solid ${theme.borderColor}`,
                borderRadius: `${12 * scale}px`,
                pointerEvents: 'none',
                opacity: 0.6
              }}
            />
          )}
          {config.template === 'corporate' && (
            <Box
              sx={{
                position: 'absolute',
                inset: `${10 * scale}px`,
                border: `1px solid ${theme.borderColor}`,
                borderRadius: `${12 * scale}px`,
                pointerEvents: 'none',
                opacity: 0.5
              }}
            />
          )}
        </>
      )}

      {/* Topo / Cabeçalho do Cartão */}
      <Box sx={{ textAlign: 'center', zIndex: 1 }}>
        {config.showTopBadge && (
          <>
            {config.template === 'modern' && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.8,
                  backgroundColor: theme.pinBg,
                  color: theme.pinColor,
                  px: `${12 * scale}px`,
                  py: `${3 * scale}px`,
                  borderRadius: '999px',
                  fontSize: `${11 * scale}px`,
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  mb: `${8 * scale}px`
                }}
              >
                <CameraIcon sx={{ fontSize: `${14 * scale}px` }} />
                {config.topBadgeText || 'Fotos ao vivo'}
              </Box>
            )}

            {config.template === 'party' && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.8,
                  backgroundColor: theme.accentColor,
                  color: '#FFFFFF',
                  px: `${12 * scale}px`,
                  py: `${3 * scale}px`,
                  borderRadius: '999px',
                  fontSize: `${11 * scale}px`,
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  mb: `${8 * scale}px`
                }}
              >
                <SparkleIcon sx={{ fontSize: `${14 * scale}px` }} />
                {config.topBadgeText || 'Fotos ao vivo no telão'}
              </Box>
            )}

            {config.template === 'corporate' && (
              <Typography
                sx={{
                  fontSize: `${11 * scale}px`,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: theme.accentColor,
                  mb: `${4 * scale}px`
                }}
              >
                {config.topBadgeText || 'Galeria Interativa Oficial'}
              </Typography>
            )}

            {config.template === 'wedding' && (
              <Typography
                sx={{
                  fontSize: `${10 * scale}px`,
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: theme.accentColor,
                  mb: `${4 * scale}px`
                }}
              >
                {config.topBadgeText || 'Lembrança Especial'}
              </Typography>
            )}

            {config.template === 'rustic' && (
              <Typography
                sx={{
                  fontSize: `${10 * scale}px`,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: theme.accentColor,
                  mb: `${4 * scale}px`
                }}
              >
                {config.topBadgeText || 'Memórias do Dia'}
              </Typography>
            )}

            {config.template === 'minimal' && (
              <Typography
                sx={{
                  fontSize: `${10 * scale}px`,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: theme.secondaryColor,
                  mb: `${4 * scale}px`
                }}
              >
                {config.topBadgeText || 'Fotos do Evento'}
              </Typography>
            )}
          </>
        )}

        <Typography
          component="h2"
          sx={{
            fontFamily: theme.titleFont,
            fontSize: `${22 * scale}px`,
            fontWeight:
              config.template === 'wedding' || config.template === 'rustic'
                ? 600
                : 800,
            lineHeight: 1.15,
            color: theme.color,
            wordBreak: 'break-word',
            px: `${10 * scale}px`
          }}
        >
          {config.title || event.name || 'Nome do Evento'}
        </Typography>

        {config.subtitle && (
          <Typography
            sx={{
              fontSize: `${13 * scale}px`,
              color: theme.secondaryColor,
              mt: `${4 * scale}px`,
              fontWeight: 500,
              fontStyle:
                config.template === 'wedding' || config.template === 'rustic'
                  ? 'italic'
                  : 'normal',
              px: `${10 * scale}px`
            }}
          >
            {config.subtitle}
          </Typography>
        )}
      </Box>

      {/* Bloco Central: QR Code e PIN */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: `${10 * scale}px`,
          zIndex: 1
        }}
      >
        <Box
          id="table-display-qr-container"
          sx={{
            p: `${14 * scale}px`,
            backgroundColor: theme.qrBackground,
            borderRadius: `${16 * scale}px`,
            boxShadow:
              config.template === 'modern'
                ? `0 ${4 * scale}px 0 #17140F`
                : `0 ${4 * scale}px ${16 * scale}px rgba(0, 0, 0, 0.08)`,
            border: theme.cardBorder || 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <QRCodeSVG
            id="table-display-qr-svg"
            value={guestUrl}
            size={qrPixelSize}
            level="H"
            marginSize={0}
          />
        </Box>

        {isPinActive && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: `${6 * scale}px`,
              backgroundColor: theme.pinBg,
              color: theme.pinColor,
              border: theme.pinBorder,
              px: `${14 * scale}px`,
              py: `${4 * scale}px`,
              borderRadius: '999px',
              fontSize: `${12 * scale}px`,
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
          >
            <LockIcon sx={{ fontSize: `${14 * scale}px` }} />
            <span>PIN:</span>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: `${15 * scale}px`,
                letterSpacing: '0.12em',
                fontWeight: 800
              }}
            >
              {event.settings.pin}
            </span>
          </Box>
        )}
      </Box>

      {/* Passo a Passo */}
      {config.showSteps && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: `${6 * scale}px`,
            backgroundColor: theme.stepBg,
            p: `${10 * scale}px ${14 * scale}px`,
            borderRadius: `${12 * scale}px`,
            zIndex: 1
          }}
        >
          <StepItem
            number="1"
            text="Aponte a câmera para o QR Code"
            icon={<CameraIcon sx={{ fontSize: `${14 * scale}px` }} />}
            theme={theme}
            scale={scale}
          />
          <StepItem
            number="2"
            text="Envie suas fotos (sem baixar app)"
            icon={<UploadIcon sx={{ fontSize: `${14 * scale}px` }} />}
            theme={theme}
            scale={scale}
          />
          <StepItem
            number="3"
            text="Veja suas fotos ao vivo no telão!"
            icon={<TvIcon sx={{ fontSize: `${14 * scale}px` }} />}
            theme={theme}
            scale={scale}
          />
        </Box>
      )}

      {/* Rodapé com Branding e Hashtag/Assessoria */}
      {config.showBranding && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `1px solid ${theme.borderColor}`,
            pt: `${8 * scale}px`,
            mt: 'auto',
            fontSize: `${10 * scale}px`,
            color: theme.secondaryColor,
            fontWeight: 600,
            letterSpacing: '0.02em',
            zIndex: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <span style={{ fontWeight: 800, color: theme.color }}>uai to na foto</span>
            <span>•</span>
            <span>fotos ao vivo</span>
          </Box>

          <Box
            component="span"
            sx={{
              opacity: 0.85,
              fontWeight: 700,
              maxWidth: `${180 * scale}px`,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {agencyOrCustom}
          </Box>
        </Box>
      )}
    </Box>
  )
}

interface StepItemProps {
  number: string
  text: string
  icon: React.ReactNode
  theme: (typeof TEMPLATE_THEMES)[TableDisplayTemplateId]
  scale: number
}

const StepItem = ({ number, text, theme, scale }: StepItemProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: `${8 * scale}px` }}>
    <Box
      sx={{
        width: `${18 * scale}px`,
        height: `${18 * scale}px`,
        borderRadius: '50%',
        backgroundColor: theme.stepNumberBg,
        color: theme.stepNumberColor,
        fontSize: `${10 * scale}px`,
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      {number}
    </Box>
    <Box
      sx={{
        fontSize: `${11 * scale}px`,
        fontWeight: 600,
        color: theme.stepTextColor,
        lineHeight: 1.2
      }}
    >
      {text}
    </Box>
  </Box>
)
