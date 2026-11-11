import { useState, useMemo } from 'react'
import {
  Box,
  Button,
  Chip,
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
  BusinessCenterOutlined as CorporateIcon,
  CropFreeOutlined as MinimalIcon,
  AutoAwesomeOutlined as NightlifeIcon,
  ParkOutlined as RusticIcon,
  QrCode2Outlined as DisplayHeaderIcon,
  PaletteOutlined as PaletteIcon,
  FormatColorResetOutlined as ResetColorIcon
} from '@mui/icons-material'
import { toast } from 'react-toastify'

import type { EventItem } from '@utils/types/events'
import { TableDisplayCard } from './templates/TableDisplayCard'
import { exportTableDisplayPng } from './exportPng'
import type {
  TableDisplayConfig,
  TableDisplayTemplateId,
  PrintPageLayout,
  TableDisplayQrSize
} from './types'
import {
  controlCardStyles,
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
  corporate: 'Compartilhe seus registros oficiais do evento',
  minimal: 'Aponte a câmera para enviar suas fotos',
  party: 'Tire sua foto e apareça no telão agora!',
  rustic: 'Guarde este momento com a gente'
}

const DEFAULT_TOP_BADGES: Record<TableDisplayTemplateId, string> = {
  wedding: 'Lembrança Especial',
  modern: 'Fotos ao vivo',
  corporate: 'Galeria Oficial',
  minimal: 'Fotos do Evento',
  party: 'Fotos ao vivo no telão',
  rustic: 'Memórias do Dia'
}

const QUICK_SUBTITLES = [
  'Aponte a câmera e entre na foto!',
  'Deixe sua lembrança deste dia tão especial',
  'Envie suas fotos sem baixar nenhum aplicativo',
  'Suas fotos ao vivo no telão do evento!'
]

interface TemplateMeta {
  id: TableDisplayTemplateId
  label: string
  icon: React.ReactNode
  accentColor: string
  previewBg: string
}

const TEMPLATE_LIST: TemplateMeta[] = [
  {
    id: 'wedding',
    label: 'Casamento',
    icon: <WeddingIcon fontSize="small" />,
    accentColor: '#9E7D47',
    previewBg: '#FAF7F2'
  },
  {
    id: 'modern',
    label: 'Moderno',
    icon: <PartyIcon fontSize="small" />,
    accentColor: '#17140F',
    previewBg: '#FFCF1F'
  },
  {
    id: 'corporate',
    label: 'Corporativo',
    icon: <CorporateIcon fontSize="small" />,
    accentColor: '#38BDF8',
    previewBg: '#0F172A'
  },
  {
    id: 'minimal',
    label: 'Minimalista',
    icon: <MinimalIcon fontSize="small" />,
    accentColor: '#111827',
    previewBg: '#FFFFFF'
  },
  {
    id: 'party',
    label: 'Festa/Neon',
    icon: <NightlifeIcon fontSize="small" />,
    accentColor: '#F43F5E',
    previewBg: '#180B24'
  },
  {
    id: 'rustic',
    label: 'Rústico',
    icon: <RusticIcon fontSize="small" />,
    accentColor: '#4A5D4E',
    previewBg: '#F5EFEB'
  }
]

const BRAND_PRESET_COLORS = [
  { label: 'Dourado / Champagne', hex: '#9E7D47' },
  { label: 'Flash Yellow', hex: '#FFCF1F' },
  { label: 'Azul Royal', hex: '#2563EB' },
  { label: 'Rosa Carmim', hex: '#E11D48' },
  { label: 'Verde Esmeralda', hex: '#059669' },
  { label: 'Roxo Violeta', hex: '#7C3AED' },
  { label: 'Terracota', hex: '#C2410C' },
  { label: 'Preto Ink', hex: '#17140F' }
]

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
    customFooter: event.customization?.agencyName || '',
    topBadgeText: DEFAULT_TOP_BADGES[initialTemplate],
    showTopBadge: true,
    showPin: Boolean(event.settings.pinEnabled),
    showSteps: true,
    showBranding: true,
    showFrame: true,
    qrSize: 'standard',
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
          : prev.subtitle,
      topBadgeText:
        prev.topBadgeText === DEFAULT_TOP_BADGES[prev.template]
          ? DEFAULT_TOP_BADGES[template]
          : prev.topBadgeText
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
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: dialogPaperStyles }}
      >
        <Box sx={dialogHeaderStyles}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <DisplayHeaderIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={800} lineHeight={1.2}>
                Displays de Mesa para Impressão
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gere cartões elegantes prontos para imprimir e colocar nas mesas dos convidados.
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" aria-label="Fechar">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={dialogContentStyles}>
          {/* Coluna Esquerda: Controles e Personalizações */}
          <Box sx={controlsSectionStyles}>
            {/* Seção 1: Modelo do Display */}
            <Box sx={controlCardStyles}>
              <Typography variant="subtitle2" fontWeight={800}>
                1. Escolha o Estilo do Display
              </Typography>
              <Box sx={templateSelectorGridStyles}>
                {TEMPLATE_LIST.map((tpl) => {
                  const isSelected = config.template === tpl.id
                  return (
                    <Box
                      key={tpl.id}
                      component="button"
                      type="button"
                      onClick={() => handleTemplateChange(tpl.id)}
                      sx={templateOptionButtonStyles(isSelected)}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: tpl.previewBg,
                          color: tpl.accentColor,
                          border: '1px solid',
                          borderColor: 'divider',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}
                      >
                        {tpl.icon}
                      </Box>
                      <Typography
                        variant="caption"
                        fontWeight={isSelected ? 800 : 600}
                        sx={{
                          lineHeight: 1.2,
                          textAlign: 'center'
                        }}
                      >
                        {tpl.label}
                      </Typography>
                    </Box>
                  )
                })}
              </Box>

              <Divider sx={{ my: 0.5 }} />

              {/* Seletor de Cor Primária / Marca do Evento */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    Cor Primária de Destaque:
                  </Typography>
                  {config.customColor && (
                    <Button
                      size="small"
                      variant="text"
                      color="inherit"
                      onClick={() => setConfig((prev) => ({ ...prev, customColor: undefined }))}
                      startIcon={<ResetColorIcon sx={{ fontSize: 13 }} />}
                      sx={{ fontSize: '0.68rem', py: 0, px: 0.5, minHeight: 0 }}
                    >
                      Padrão do modelo
                    </Button>
                  )}
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    flexWrap: 'wrap'
                  }}
                >
                  {BRAND_PRESET_COLORS.map((c) => {
                    const isSelected =
                      config.customColor?.toLowerCase() === c.hex.toLowerCase()
                    return (
                      <Tooltip key={c.hex} title={c.label}>
                        <Box
                          component="button"
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({ ...prev, customColor: c.hex }))
                          }
                          sx={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            bgcolor: c.hex,
                            border: '2px solid',
                            borderColor: isSelected ? 'text.primary' : 'transparent',
                            outline: isSelected ? '2px solid #FFCF1F' : 'none',
                            outlineOffset: '1px',
                            cursor: 'pointer',
                            p: 0,
                            transition: 'transform 0.15s ease',
                            '&:hover': {
                              transform: 'scale(1.15)'
                            }
                          }}
                        />
                      </Tooltip>
                    )
                  })}

                  {/* Color Picker nativo com ícone interativo */}
                  <Tooltip title="Abrir Color Picker livre">
                    <Box
                      component="label"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        border: '1.5px dashed',
                        borderColor: config.customColor ? 'primary.main' : 'divider',
                        bgcolor: config.customColor || 'action.hover',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 0.15s ease',
                        '&:hover': { transform: 'scale(1.1)' }
                      }}
                    >
                      <input
                        type="color"
                        value={config.customColor || '#9E7D47'}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, customColor: e.target.value }))
                        }
                        style={{
                          position: 'absolute',
                          top: -10,
                          left: -10,
                          width: 50,
                          height: 50,
                          opacity: 0,
                          cursor: 'pointer'
                        }}
                      />
                      <PaletteIcon
                        sx={{
                          fontSize: 14,
                          color: config.customColor ? '#FFFFFF' : 'text.secondary',
                          pointerEvents: 'none'
                        }}
                      />
                    </Box>
                  </Tooltip>

                  {/* Input direto de código HEX */}
                  <TextField
                    size="small"
                    placeholder="#HEX"
                    value={config.customColor || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, customColor: e.target.value }))
                    }
                    slotProps={{
                      htmlInput: {
                        maxLength: 9,
                        style: {
                          fontSize: '0.72rem',
                          padding: '3px 6px',
                          width: '74px',
                          fontFamily: 'monospace'
                        }
                      }
                    }}
                    sx={{ ml: 'auto' }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Seção 2: Textos e Mensagens */}
            <Box sx={controlCardStyles}>
              <Typography variant="subtitle2" fontWeight={800}>
                2. Textos e Mensagens
              </Typography>
              <TextField
                label="Título do Evento"
                size="small"
                fullWidth
                value={config.title}
                onChange={(e) => setConfig((prev) => ({ ...prev, title: e.target.value }))}
              />
              <TextField
                label="Subtítulo / Chamada"
                size="small"
                fullWidth
                value={config.subtitle}
                onChange={(e) => setConfig((prev) => ({ ...prev, subtitle: e.target.value }))}
              />

              {/* Sugestões rápidas de subtítulo */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Sugestões rápidas:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {QUICK_SUBTITLES.map((text) => (
                    <Chip
                      key={text}
                      label={text}
                      size="small"
                      variant={config.subtitle === text ? 'filled' : 'outlined'}
                      color={config.subtitle === text ? 'primary' : 'default'}
                      onClick={() => setConfig((prev) => ({ ...prev, subtitle: text }))}
                      sx={{ fontSize: '0.72rem', cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>

              <TextField
                label="Hashtag ou Assessoria no rodapé"
                placeholder="Ex: #CasamentoGabiERafa ou @assessoria"
                size="small"
                fullWidth
                value={config.customFooter || ''}
                onChange={(e) => setConfig((prev) => ({ ...prev, customFooter: e.target.value }))}
                helperText="Aparecerá no rodapé do display junto ao branding oficial"
              />
            </Box>

            {/* Seção 3: Elementos e Detalhes Visuais */}
            <Box sx={controlCardStyles}>
              <Typography variant="subtitle2" fontWeight={800}>
                3. Elementos do Display
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={config.showTopBadge}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, showTopBadge: e.target.checked }))
                    }
                  />
                }
                label={<Typography variant="body2">Selo / Badge de destaque no topo</Typography>}
              />

              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={config.showFrame}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, showFrame: e.target.checked }))
                    }
                  />
                }
                label={<Typography variant="body2">Moldura / Borda decorativa</Typography>}
              />

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

              <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Destaque do QR Code:
                </Typography>
                <Select
                  size="small"
                  value={config.qrSize}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      qrSize: e.target.value as TableDisplayQrSize
                    }))
                  }
                >
                  <MenuItem value="standard">Tamanho Normal (Equilibrado com instruções)</MenuItem>
                  <MenuItem value="large">Tamanho Destacado (Maior alcance para leitura)</MenuItem>
                </Select>
              </Box>
            </Box>

            {/* Seção 4: Formato de Impressão */}
            <Box sx={controlCardStyles}>
              <Typography variant="subtitle2" fontWeight={800}>
                4. Layout para Impressão
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
                <MenuItem value="a6">1 display por página (Tamanho 10x15cm / A6)</MenuItem>
                <MenuItem value="a4_double">2 displays por folha A4 (com guia de corte)</MenuItem>
                <MenuItem value="a4_quad">4 displays por folha A4 (econômico)</MenuItem>
              </Select>
            </Box>
          </Box>

          {/* Coluna Direita: Pré-visualização Realista */}
          <Box sx={previewWrapperStyles}>
            <Box
              sx={{
                position: 'absolute',
                top: 14,
                left: 18,
                right: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 2
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <span>PRÉ-VISUALIZAÇÃO • 10x15CM</span>
              </Typography>
              <Chip
                label="Porta-retrato A6"
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  height: 22,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              />
            </Box>

            <Box
              sx={{
                mt: 4,
                mb: 1,
                filter: 'drop-shadow(0 16px 32px rgba(0, 0, 0, 0.18))',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.01)'
                }
              }}
            >
              <TableDisplayCard
                event={event}
                guestUrl={guestUrl}
                config={config}
                scale={0.92}
              />
            </Box>
          </Box>
        </Box>

        {/* Rodapé de Ações do Modal */}
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
            <Tooltip title="Gera imagem em alta resolução (300 DPI) com o QR Code nítido para envio a gráficas ou uso digital">
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
              sx={{
                ...dialogActionButtonStyles,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              }}
            >
              Imprimir / Salvar PDF
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Regras CSS de Impressão Direta */}
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

      {/* Estrutura Oculta que é ativada exclusivamente na Impressão */}
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
              gap: '15mm',
              justifyItems: 'center',
              alignItems: 'center',
              minHeight: '100vh',
              p: '5mm',
              boxSizing: 'border-box'
            }}
          >
            <Box sx={{ borderRight: '1px dashed #999999', pr: '8mm' }}>
              <TableDisplayCard
                event={event}
                guestUrl={guestUrl}
                config={config}
                scale={0.95}
              />
            </Box>
            <Box sx={{ pl: '8mm' }}>
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
              gap: '8mm',
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
                  outline: '1px dashed #aaaaaa',
                  outlineOffset: '4mm',
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
