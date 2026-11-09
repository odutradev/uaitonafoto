import { useState, useMemo } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import {
  Close as CloseIcon,
  DownloadOutlined as DownloadIcon,
  PrintOutlined as PrintIcon,
  FavoriteOutlined as WeddingIcon,
  CelebrationOutlined as PartyIcon,
  BusinessCenterOutlined as CorporateIcon
} from '@mui/icons-material'
import { toast } from 'react-toastify'

import type { EventItem } from '@actions/events/types'
import { TableDisplayCard } from './templates/TableDisplayCard'
import { exportTableDisplayPng } from './exportPng'
import type {
  TableDisplayConfig,
  TableDisplayTemplateId,
  PrintPageLayout
} from './types'
import {
  controlGroupStyles,
  controlsSectionStyles,
  dialogActionButtonStyles,
  dialogActionsStyles,
  dialogContentStyles,
  dialogHeaderStyles,
  dialogPaperStyles,
  previewWrapperStyles,
  templateOptionButtonStyles,
  templateSelectorGridStyles
} from './styles'

interface TableDisplayModalProps {
  open: boolean
  onClose: () => void
  event: EventItem
  guestUrl: string
}

const DEFAULT_SUBTITLES: Record<TableDisplayTemplateId, string> = {
  wedding: 'Deixe sua lembrança deste dia tão especial',
  modern: 'Aponte a câmera e entre na foto!',
  corporate: 'Compartilhe seus registros oficiais do evento'
}

export const TableDisplayModal = ({
  open,
  onClose,
  event,
  guestUrl
}: TableDisplayModalProps) => {
  const initialTemplate: TableDisplayTemplateId = useMemo(() => {
    if (event.type === 'wedding') return 'wedding'
    if (event.type === 'corporate') return 'corporate'
    return 'modern'
  }, [event.type])

  const [config, setConfig] = useState<TableDisplayConfig>({
    template: initialTemplate,
    title: event.name || '',
    subtitle: DEFAULT_SUBTITLES[initialTemplate],
    showPin: Boolean(event.settings.pinEnabled),
    showSteps: true,
    showBranding: true,
    pageLayout: 'a6'
  })

  const [isExportingPng, setIsExportingPng] = useState(false)

  const handleTemplateChange = (template: TableDisplayTemplateId) => {
    setConfig((prev) => ({
      ...prev,
      template,
      subtitle:
        prev.subtitle === DEFAULT_SUBTITLES[prev.template]
          ? DEFAULT_SUBTITLES[template]
          : prev.subtitle
    }))
  }

  const handleExportPng = async () => {
    setIsExportingPng(true)
    try {
      await exportTableDisplayPng({
        event,
        guestUrl,
        config
      })
      toast.success('Imagem em alta resolução (300 DPI) gerada com sucesso!')
    } catch (err) {
      console.error(err)
      toast.error('Erro ao gerar imagem para impressão.')
    } finally {
      setIsExportingPng(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: dialogPaperStyles }}
      >
        <Box sx={dialogHeaderStyles}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Displays de Mesa para Impressão
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gere cartões elegantes (A6 / 10x15cm) prontos para imprimir e colocar nas mesas dos convidados.
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" aria-label="Fechar">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={dialogContentStyles}>
          <Box sx={controlsSectionStyles}>
            <Box sx={controlGroupStyles}>
              <Typography variant="subtitle2" fontWeight={700}>
                Modelo do Display
              </Typography>
              <Box sx={templateSelectorGridStyles}>
                <Box
                  component="button"
                  type="button"
                  onClick={() => handleTemplateChange('wedding')}
                  sx={templateOptionButtonStyles(config.template === 'wedding')}
                >
                  <WeddingIcon
                    fontSize="small"
                    sx={{ color: config.template === 'wedding' ? 'primary.main' : '#9E7D47' }}
                  />
                  <Typography variant="caption" fontWeight={700}>
                    Casamento
                  </Typography>
                </Box>

                <Box
                  component="button"
                  type="button"
                  onClick={() => handleTemplateChange('modern')}
                  sx={templateOptionButtonStyles(config.template === 'modern')}
                >
                  <PartyIcon
                    fontSize="small"
                    sx={{ color: config.template === 'modern' ? 'primary.main' : '#F5C30A' }}
                  />
                  <Typography variant="caption" fontWeight={700}>
                    Moderno
                  </Typography>
                </Box>

                <Box
                  component="button"
                  type="button"
                  onClick={() => handleTemplateChange('corporate')}
                  sx={templateOptionButtonStyles(config.template === 'corporate')}
                >
                  <CorporateIcon
                    fontSize="small"
                    sx={{ color: config.template === 'corporate' ? 'primary.main' : '#0284C7' }}
                  />
                  <Typography variant="caption" fontWeight={700}>
                    Corporativo
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider />

            <Box sx={controlGroupStyles}>
              <Typography variant="subtitle2" fontWeight={700}>
                Textos do Cartão
              </Typography>
              <TextField
                label="Título do Evento"
                size="small"
                fullWidth
                value={config.title}
                onChange={(e) => setConfig((prev) => ({ ...prev, title: e.target.value }))}
              />
              <TextField
                label="Subtítulo / Mensagem"
                size="small"
                fullWidth
                value={config.subtitle}
                onChange={(e) => setConfig((prev) => ({ ...prev, subtitle: e.target.value }))}
              />
            </Box>

            <Divider />

            <Box sx={controlGroupStyles}>
              <Typography variant="subtitle2" fontWeight={700}>
                Formato de Impressão
              </Typography>
              <Select
                size="small"
                value={config.pageLayout}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    pageLayout: e.target.value as PrintPageLayout
                  }))
                }
              >
                <MenuItem value="a6">1 display por página (Tamanho A6 / 10x15cm)</MenuItem>
                <MenuItem value="a4_double">2 displays por folha A4 (corte ao meio)</MenuItem>
                <MenuItem value="a4_quad">4 displays por folha A4 (econômico)</MenuItem>
              </Select>
            </Box>

            <Divider />

            <Box sx={controlGroupStyles}>
              <Typography variant="subtitle2" fontWeight={700}>
                Elementos Visuais
              </Typography>

              {event.settings.pinEnabled && (
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={config.showPin}
                      onChange={(e) =>
                        setConfig((prev) => ({ ...prev, showPin: e.target.checked }))
                      }
                    />
                  }
                  label={
                    <Typography variant="body2">
                      Exibir PIN no cartão ({event.settings.pin})
                    </Typography>
                  }
                />
              )}

              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={config.showSteps}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, showSteps: e.target.checked }))
                    }
                  />
                }
                label={<Typography variant="body2">Instruções passo a passo (1, 2, 3)</Typography>}
              />

              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={config.showBranding}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, showBranding: e.target.checked }))
                    }
                  />
                }
                label={<Typography variant="body2">Rodapé com marca / assessoria</Typography>}
              />
            </Box>
          </Box>

          <Box sx={previewWrapperStyles}>
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                top: 12,
                left: 16,
                fontWeight: 700,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Pré-visualização (10x15cm)
            </Typography>

            <Box sx={{ mt: 2 }}>
              <TableDisplayCard
                event={event}
                guestUrl={guestUrl}
                config={config}
                scale={0.92}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={dialogActionsStyles}>
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            onClick={onClose}
            sx={dialogActionButtonStyles}
          >
            Fechar
          </Button>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Tooltip title="Baixa uma imagem em altíssima resolução (300 DPI) para enviar a uma gráfica ou compartilhar">
              <span>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={
                    isExportingPng ? (
                      <CircularProgress size={14} color="inherit" />
                    ) : (
                      <DownloadIcon sx={{ fontSize: 16 }} />
                    )
                  }
                  onClick={handleExportPng}
                  disabled={isExportingPng}
                  sx={dialogActionButtonStyles}
                >
                  Baixar PNG (300 DPI)
                </Button>
              </span>
            </Tooltip>

            <Button
              size="small"
              variant="contained"
              startIcon={<PrintIcon sx={{ fontSize: 16 }} />}
              onClick={handlePrint}
              sx={dialogActionButtonStyles}
            >
              Imprimir / Salvar PDF
            </Button>
          </Box>
        </Box>
      </Dialog>

      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-table-displays-root,
          #print-table-displays-root * {
            visibility: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #print-table-displays-root {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            display: block !important;
          }
          @page {
            size: ${config.pageLayout === 'a6' ? '105mm 148mm' : 'A4 portrait'};
            margin: ${config.pageLayout === 'a6' ? '0' : '10mm'};
          }
        }
      `}</style>

      <Box
        id="print-table-displays-root"
        sx={{
          display: 'none',
          '@media print': {
            display: 'block !important'
          }
        }}
      >
        {config.pageLayout === 'a6' && (
          <Box
            sx={{
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pageBreakInside: 'avoid'
            }}
          >
            <TableDisplayCard
              event={event}
              guestUrl={guestUrl}
              config={config}
              scale={1}
            />
          </Box>
        )}

        {config.pageLayout === 'a4_double' && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20mm',
              justifyItems: 'center',
              alignItems: 'center',
              minHeight: '100vh',
              p: '5mm',
              boxSizing: 'border-box'
            }}
          >
            <Box sx={{ borderRight: '1px dashed #cccccc', pr: '10mm' }}>
              <TableDisplayCard
                event={event}
                guestUrl={guestUrl}
                config={config}
                scale={0.95}
              />
            </Box>
            <Box sx={{ pl: '10mm' }}>
              <TableDisplayCard
                event={event}
                guestUrl={guestUrl}
                config={config}
                scale={0.95}
              />
            </Box>
          </Box>
        )}

        {config.pageLayout === 'a4_quad' && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gridTemplateRows: 'repeat(2, 1fr)',
              gap: '10mm',
              justifyItems: 'center',
              alignItems: 'center',
              minHeight: '100vh',
              p: '5mm',
              boxSizing: 'border-box'
            }}
          >
            {[1, 2, 3, 4].map((idx) => (
              <Box
                key={idx}
                sx={{
                  outline: '1px dashed #e0e0e0',
                  outlineOffset: '5mm',
                  m: '2mm'
                }}
              >
                <TableDisplayCard
                  event={event}
                  guestUrl={guestUrl}
                  config={config}
                  scale={0.72}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </>
  )
}
