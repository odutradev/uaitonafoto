import { useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material'
import {
  Chat as WhatsAppIcon,
  PaletteOutlined as PaletteIcon,
  SaveOutlined as SaveIcon,
  TvOutlined as ScreenIcon,
  SmartphoneOutlined as MobileIcon,
  StarOutline as ProIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { getMeData, updateMeData } from '@actions/auth'
import useAuth from '@hooks/useAuth'
import useAuthStore from '@stores/auth'

import {
  customizationRootStyles,
  formCardStyles,
  headerBoxStyles,
  mainGridStyles,
  previewBadgeStyles,
  previewCardStyles,
  previewFrameStyles,
  switchCardStyles,
  whatsappPreviewButtonStyles
} from './styles'
import type { FormEvent } from 'react'
import type { CustomizationFormState } from './types'

const Customization = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const setAuthUser = useAuthStore((state) => state.updateUser)

  const hasPlan = Boolean(user?.hasActiveSubscription)

  const [form, setForm] = useState<CustomizationFormState>(() => ({
    enabled: user?.customization?.enabled ?? true,
    agencyName: user?.customization?.agencyName ?? '',
    agencyLogoUrl: user?.customization?.agencyLogoUrl ?? '',
    agencyWhatsapp: user?.customization?.agencyWhatsapp ?? '',
    agencyTagline: user?.customization?.agencyTagline ?? 'Assessoria & Cerimonial',
    whatsappMessage:
      user?.customization?.whatsappMessage ??
      'Olá! Vi a marca de vocês no evento e gostaria de mais informações para um orçamento.'
  }))

  const [previewTab, setPreviewTab] = useState<'screen' | 'app'>('screen')
  const [isSaving, setIsSaving] = useState(false)

  const setField = <K extends keyof CustomizationFormState>(key: K, value: CustomizationFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!hasPlan) {
      toast.error('É necessário um plano de agência ativo para salvar a personalização.')
      return
    }

    setIsSaving(true)
    try {
      await updateMeData({
        customization: form
      })
      const freshUser = await getMeData()
      setAuthUser(freshUser)
      toast.success('Configurações de personalização salvas!')
    } catch {
      toast.error('Não foi possível salvar as configurações.')
    } finally {
      setIsSaving(false)
    }
  }

  const cleanPhone = form.agencyWhatsapp?.replace(/\D/g, '') || ''
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(form.whatsappMessage || '')}`

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
          Configure a marca do seu cerimonial ou assessoria para ser exibida no topo do telão e do aplicativo dos convidados com botão direto para WhatsApp gerador de leads.
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
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                {form.agencyLogoUrl ? (
                  <Avatar src={form.agencyLogoUrl} alt={form.agencyName} sx={{ width: 34, height: 34 }} />
                ) : (
                  <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 800, fontSize: '0.85rem' }}>
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
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
              Cada convidado que acessar o mural ou olhar o telão pode tocar no botão para iniciar conversa imediata com sua agência.
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  )
}

export default Customization
