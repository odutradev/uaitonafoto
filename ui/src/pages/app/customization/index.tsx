import useCustomizationPage, { CustomizationPageProvider } from './hook'
import { Alert, Avatar, Box, Button, Card, Chip, CircularProgress, Switch, Tab, Tabs, TextField, Typography } from '@mui/material'
import { Chat as WhatsAppIcon, PaletteOutlined as PaletteIcon, SaveOutlined as SaveIcon, TvOutlined as ScreenIcon, SmartphoneOutlined as MobileIcon, StarOutline as ProIcon } from '@mui/icons-material'


import { customizationRootStyles, formCardStyles, headerBoxStyles, mainGridStyles, previewCardStyles, previewFrameStyles, switchCardStyles, whatsappPreviewButtonStyles } from './styles'

const CustomizationContent = () => {
  const { navigate, hasPlan, form, setField, previewTab, setPreviewTab, isSaving, handleSubmit, cleanPhone, whatsappUrl } = useCustomizationPage()

  return (
    <Box sx={customizationRootStyles}>
      <Box sx={headerBoxStyles}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h5" component="h1" fontWeight={800}>
            Personalização & Selo White-Label
          </Typography>
          <Chip
            size="small"
            color="primary"
            icon={<ProIcon fontSize="small" />}
            label="Plano Agência"
            sx={{ fontWeight: 700 }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Configure a marca do seu cerimonial ou assessoria para ser exibida no topo do telão e no aplicativo dos convidados com botão de WhatsApp gerador de leads no app.
        </Typography>
      </Box>

      {!hasPlan && (
        <Alert
          severity="warning"
          action={
            <Button color="inherit" size="small" onClick={() => navigate('/app/billing')}>
              Ver planos de agência
            </Button>
          }
        >
          A personalização White-Label é um recurso exclusivo para assinantes dos planos de agência. Assine um plano para ativar sua marca e capturar leads em todos os seus eventos.
        </Alert>
      )}

      <Box sx={mainGridStyles}>
        <Card elevation={0} component="form" onSubmit={handleSubmit} sx={formCardStyles}>
          <Box sx={switchCardStyles}>
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>
                Ativar Selo White-Label
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Exibe automaticamente a marca e o WhatsApp nos eventos criados pela sua conta.
              </Typography>
            </Box>
            <Switch
              disabled={!hasPlan}
              checked={form.enabled}
              onChange={(e) => setField('enabled', e.target.checked)}
            />
          </Box>

          <TextField
            label="Nome da assessoria ou empresa"
            placeholder="Ex: Real Cerimonial & Eventos"
            value={form.agencyName}
            onChange={(e) => setField('agencyName', e.target.value)}
            disabled={!hasPlan || !form.enabled}
            slotProps={{ htmlInput: { maxLength: 80 } }}
            helperText="Nome principal exibido no selo de parceiro/organizador."
            fullWidth
            required
          />

          <TextField
            label="Texto de apoio / Tagline"
            placeholder="Ex: Assessoria e Cerimonial"
            value={form.agencyTagline}
            onChange={(e) => setField('agencyTagline', e.target.value)}
            disabled={!hasPlan || !form.enabled}
            slotProps={{ htmlInput: { maxLength: 60 } }}
            helperText="Texto auxiliar exibido acima ou ao lado do nome."
            fullWidth
          />

          <TextField
            label="WhatsApp da agência (com DDD)"
            placeholder="Ex: 5531999999999"
            value={form.agencyWhatsapp}
            onChange={(e) => setField('agencyWhatsapp', e.target.value)}
            disabled={!hasPlan || !form.enabled}
            helperText="Número para onde os convidados enviarão mensagens ao clicar no botão de lead."
            fullWidth
            required
          />

          <TextField
            label="Mensagem padrão do WhatsApp"
            multiline
            rows={2}
            value={form.whatsappMessage}
            onChange={(e) => setField('whatsappMessage', e.target.value)}
            disabled={!hasPlan || !form.enabled}
            helperText="Texto pré-preenchido que o convidado enviará ao abrir o WhatsApp."
            fullWidth
          />

          <TextField
            label="URL da Logo da Agência (opcional)"
            placeholder="https://suaempresa.com/logo.png"
            value={form.agencyLogoUrl}
            onChange={(e) => setField('agencyLogoUrl', e.target.value)}
            disabled={!hasPlan || !form.enabled}
            helperText="Imagem quadrada ou com fundo transparente recomendada."
            fullWidth
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                component="input"
                type="color"
                value={form.primaryColor || '#FFD21F'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField('primaryColor', e.target.value)}
                disabled={!hasPlan || !form.enabled}
                sx={{
                  width: 44,
                  height: 40,
                  p: 0.5,
                  borderRadius: '8px',
                  border: 1,
                  borderColor: 'divider',
                  cursor: hasPlan && form.enabled ? 'pointer' : 'default',
                  bgcolor: 'background.paper',
                  '&::-webkit-color-swatch-wrapper': { p: 0 },
                  '&::-webkit-color-swatch': { borderRadius: '6px', border: 'none' }
                }}
              />
              <TextField
                size="small"
                label="Cor de destaque do badge (opcional)"
                placeholder="#FFD21F"
                value={form.primaryColor ?? ''}
                onChange={(e) => setField('primaryColor', e.target.value)}
                disabled={!hasPlan || !form.enabled}
                fullWidth
                helperText="Cor da borda e detalhes do selo da assessoria no telão"
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', pt: 0.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
                Sugestões:
              </Typography>
              {[
                { name: 'Dourado', hex: '#FFD21F' },
                { name: 'Ouro Real', hex: '#F59E0B' },
                { name: 'Rosa', hex: '#EC4899' },
                { name: 'Esmeralda', hex: '#10B981' },
                { name: 'Roxo', hex: '#8B5CF6' },
                { name: 'Azul', hex: '#3B82F6' },
                { name: 'Branco', hex: '#FFFFFF' }
              ].map((preset) => {
                const isSelected = (form.primaryColor || '').toLowerCase() === preset.hex.toLowerCase()
                return (
                  <Chip
                    key={preset.hex}
                    label={preset.name}
                    size="small"
                    onClick={() => hasPlan && form.enabled && setField('primaryColor', preset.hex)}
                    disabled={!hasPlan || !form.enabled}
                    sx={{
                      height: 22,
                      fontSize: '0.68rem',
                      cursor: hasPlan && form.enabled ? 'pointer' : 'default',
                      borderColor: isSelected ? preset.hex : 'divider',
                      borderWidth: 1,
                      borderStyle: 'solid',
                      bgcolor: isSelected ? `${preset.hex}22` : 'transparent',
                      '&:hover': {
                        bgcolor: `${preset.hex}33`
                      }
                    }}
                    avatar={
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: preset.hex,
                          border: '1px solid rgba(0,0,0,0.2)',
                          ml: '4px !important'
                        }}
                      />
                    }
                  />
                )
              })}
            </Box>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={!hasPlan || isSaving}
            startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon fontSize="small" />}
            sx={{ minHeight: 48, fontWeight: 800, mt: 1 }}
          >
            {isSaving ? 'Salvando...' : 'Salvar configurações'}
          </Button>
        </Card>

        <Card elevation={0} sx={previewCardStyles}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" fontWeight={800}>
              Prévia do Selo White-Label
            </Typography>
            <PaletteIcon color="action" fontSize="small" />
          </Box>

          <Tabs
            value={previewTab}
            onChange={(_, val) => setPreviewTab(val)}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<ScreenIcon fontSize="small" />} iconPosition="start" label="No Telão" value="screen" />
            <Tab icon={<MobileIcon fontSize="small" />} iconPosition="start" label="No Celular" value="app" />
          </Tabs>

          <Box sx={previewFrameStyles}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                {previewTab === 'screen' ? 'TOPO DO TELÃO (AO VIVO)' : 'TOPO DO MURAL MOBILE'}
              </Typography>
              <Chip size="small" label="Modo Demo" sx={{ height: 20, fontSize: '0.65rem' }} />
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.5,
                p: 1.5,
                borderRadius: '12px',
                bgcolor: 'rgba(255, 255, 255, 0.04)',
                border: `1.5px solid ${
                  previewTab === 'screen' && form.primaryColor
                    ? form.primaryColor
                    : 'rgba(255, 255, 255, 0.1)'
                }`,
                boxShadow:
                  previewTab === 'screen' && form.primaryColor
                    ? `0 0 16px ${form.primaryColor}33`
                    : 'none'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                {form.agencyLogoUrl ? (
                  <Avatar
                    src={form.agencyLogoUrl}
                    alt={form.agencyName}
                    sx={{
                      width: 34,
                      height: 34,
                      border: form.primaryColor ? `1.5px solid ${form.primaryColor}` : 'none'
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: form.primaryColor || 'primary.main',
                      color: 'primary.contrastText',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      border: form.primaryColor ? `1.5px solid ${form.primaryColor}` : 'none'
                    }}
                  >
                    {form.agencyName ? form.agencyName.charAt(0).toUpperCase() : 'A'}
                  </Avatar>
                )}

                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" sx={{ color: '#ABA392', display: 'block', lineHeight: 1 }}>
                    {form.agencyTagline || 'Assessoria & Cerimonial'}
                  </Typography>
                  <Typography variant="body2" fontWeight={800} sx={{ color: '#FBF8F1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {form.agencyName || 'Sua Assessoria Aqui'}
                  </Typography>
                </Box>
              </Box>

              {previewTab === 'app' && (
                <Button
                  component="a"
                  href={cleanPhone ? whatsappUrl : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  startIcon={<WhatsAppIcon sx={{ fontSize: '1rem !important' }} />}
                  sx={whatsappPreviewButtonStyles}
                >
                  WhatsApp
                </Button>
              )}
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
              {previewTab === 'screen'
                ? 'No telão do evento, sua marca é exibida com destaque sem botões interativos.'
                : 'No mural mobile, os convidados podem tocar no botão para iniciar conversa imediata pelo WhatsApp com sua agência.'}
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  )
}

const Customization = () => (
  <CustomizationPageProvider>
    <CustomizationContent />
  </CustomizationPageProvider>
)

export default Customization
