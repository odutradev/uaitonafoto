import { useEffect, useState } from 'react'
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
  DeleteOutline as DeleteIcon,
  DesktopWindowsOutlined as ScreenIcon,
  PaletteOutlined as PaletteIcon,
  PhoneIphoneOutlined as MobileIcon,
  SaveOutlined as SaveIcon,
  StarOutline as ProIcon,
  Chat as WhatsAppIcon,
  SyncOutlined as SyncIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import EventFormFields, { isValidEventPeriod, isValidEventPin, toEventForm, toEventPayload } from '@components/eventFormFields'
import { isEventStarted } from '@config/eventPhase'
import Modal from '@components/modal'
import useAuth from '@hooks/useAuth'

import {
  customizationCardStyles,
  customizationSwitchRowStyles,
  dangerCardStyles,
  dangerRowStyles,
  previewBoxStyles,
  settingsActionsRowStyles,
  settingsButtonStyles,
  settingsCardStyles,
  settingsSectionStackStyles
} from './styles'
import type { FormEvent } from 'react'
import type { EventFormState } from '@components/eventFormFields/types'
import type { EventSettingsProps } from './types'
import type { EventCustomization } from '@actions/events/types'

const EventSettings = ({ event, onSave, onDelete }: EventSettingsProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const hasPlan = Boolean(user?.hasActiveSubscription)

  const initialForm = toEventForm(event)
  const [form, setForm] = useState<EventFormState>(() => initialForm)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [previewTab, setPreviewTab] = useState<'screen' | 'app'>('screen')

  useEffect(() => {
    setForm(toEventForm(event))
  }, [event])

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm)

  const setField = <K extends keyof EventFormState>(key: K, value: EventFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const updateCustomization = (patch: Partial<EventCustomization>) => {
    setForm((current) => {
      const existing = current.customization ?? {
        enabled: true,
        agencyName: '',
        agencyLogoUrl: '',
        agencyWhatsapp: '',
        agencyTagline: 'Assessoria & Cerimonial',
        whatsappMessage: 'Olá! Vi a marca de vocês no evento e gostaria de mais informações.'
      }
      return {
        ...current,
        customization: {
          ...existing,
          ...patch
        }
      }
    })
  }

  const handleApplyAgencyDefaults = () => {
    if (!user?.customization) {
      toast.info('Nenhuma personalização global configurada ainda.')
      return
    }
    setForm((current) => ({
      ...current,
      customization: {
        ...user.customization,
        enabled: true
      }
    }))
    toast.success('Dados da agência aplicados ao evento!')
  }

  const handleSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault()

    if (!isValidEventPeriod(form)) {
      toast.error('O término do evento deve ser depois do início.')
      return
    }

    if (!isValidEventPin(form)) {
      toast.error('O PIN de acesso deve ter exatamente 4 dígitos numéricos.')
      return
    }

    setIsSaving(true)
    await onSave(toEventPayload(form))
    setIsSaving(false)
  }

  const handleConfirmDelete = async () => {
    if (!onDelete) return
    setIsDeleting(true)
    await onDelete()
    setIsDeleting(false)
    setIsDeleteModalOpen(false)
  }

  const customConfig = form.customization
  const isCustomEnabled = Boolean(customConfig?.enabled)

  return (
    <Box sx={settingsSectionStackStyles}>
      <Card elevation={0} component="form" onSubmit={handleSubmit} sx={settingsCardStyles}>
        <Box>
          <Typography variant="h6" component="h2">
            Dados e regras do evento
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Ajuste o nome, tipo, data de início, visibilidade no mural e senha de acesso.
          </Typography>
        </Box>

        <EventFormFields form={form} onChange={setField} isEventStarted={isEventStarted(event.startsAt)} />

        <Card elevation={0} sx={customizationCardStyles}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <PaletteIcon sx={{ color: 'primary.main', fontSize: 26 }} />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Selo White-Label para Cerimonial (B2B)
                  </Typography>
                  <Chip
                    icon={<ProIcon sx={{ fontSize: '14px !important' }} />}
                    label="PRO"
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText'
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Exibe a marca da sua assessoria no topo do telão e no aplicativo dos convidados (com botão direto para WhatsApp no app).
                </Typography>
              </Box>
            </Box>

            {hasPlan && user?.customization && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<SyncIcon fontSize="small" />}
                onClick={handleApplyAgencyDefaults}
                sx={{ borderRadius: '10px', textTransform: 'none' }}
              >
                Puxar dados da agência
              </Button>
            )}
          </Box>

          {!hasPlan ? (
            <Alert
              severity="warning"
              action={
                <Button color="inherit" size="small" onClick={() => navigate('/app/billing')}>
                  Ver planos
                </Button>
              }
              sx={{ borderRadius: '12px' }}
            >
              Esta funcionalidade é exclusiva para assinantes de planos de agência. Assine um plano para personalizar seus eventos.
            </Alert>
          ) : (
            <>
              <Box sx={customizationSwitchRowStyles}>
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    Ativar Selo White-Label neste evento
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Habilita o banner da assessoria com logotipo no topo do telão e com WhatsApp no app dos convidados.
                  </Typography>
                </Box>
                <Switch
                  checked={isCustomEnabled}
                  onChange={(e) => updateCustomization({ enabled: e.target.checked })}
                  color="primary"
                />
              </Box>

              {isCustomEnabled && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 2
                    }}
                  >
                    <TextField
                      label="Nome da Assessoria / Cerimonial"
                      placeholder="Ex: Cerimonial Real & Eventos"
                      value={customConfig?.agencyName ?? ''}
                      onChange={(e) => updateCustomization({ agencyName: e.target.value })}
                      fullWidth
                    />
                    <TextField
                      label="Tagline / Slogan"
                      placeholder="Ex: Assessoria & Organização de Casamentos"
                      value={customConfig?.agencyTagline ?? ''}
                      onChange={(e) => updateCustomization({ agencyTagline: e.target.value })}
                      fullWidth
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 2
                    }}
                  >
                    <TextField
                      label="URL do Logotipo (quadrado ou ícone)"
                      placeholder="https://..."
                      value={customConfig?.agencyLogoUrl ?? ''}
                      onChange={(e) => updateCustomization({ agencyLogoUrl: e.target.value })}
                      fullWidth
                    />
                    <TextField
                      label="WhatsApp para Contato (DDD + Número)"
                      placeholder="Ex: 31999998888"
                      value={customConfig?.agencyWhatsapp ?? ''}
                      onChange={(e) => updateCustomization({ agencyWhatsapp: e.target.value })}
                      fullWidth
                      helperText="Somente números com DDD"
                    />
                  </Box>

                  <TextField
                    label="Mensagem inicial do WhatsApp (opcional)"
                    placeholder="Mensagem pré-preenchida que o cliente enviará ao clicar no botão..."
                    value={customConfig?.whatsappMessage ?? ''}
                    onChange={(e) => updateCustomization({ whatsappMessage: e.target.value })}
                    fullWidth
                    multiline
                    rows={2}
                  />

                  <Box sx={previewBoxStyles}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                      <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                        {previewTab === 'screen' ? 'Pré-visualização no Telão (Ao Vivo)' : 'Pré-visualização no App dos Convidados'}
                      </Typography>
                      <Chip
                        size="small"
                        label={previewTab === 'screen' ? 'Sem botões interativos' : 'Com botão WhatsApp'}
                        sx={{ height: 20, fontSize: '0.65rem' }}
                      />
                    </Box>

                    <Tabs
                      value={previewTab}
                      onChange={(_, val) => setPreviewTab(val)}
                      variant="fullWidth"
                      sx={{ borderBottom: 1, borderColor: 'rgba(255, 184, 0, 0.2)', minHeight: 36 }}
                    >
                      <Tab
                        icon={<ScreenIcon sx={{ fontSize: '1rem' }} />}
                        iconPosition="start"
                        label="No Telão"
                        value="screen"
                        sx={{ minHeight: 36, py: 0.5, textTransform: 'none', fontSize: '0.8rem' }}
                      />
                      <Tab
                        icon={<MobileIcon sx={{ fontSize: '1rem' }} />}
                        iconPosition="start"
                        label="No App dos Convidados"
                        value="app"
                        sx={{ minHeight: 36, py: 0.5, textTransform: 'none', fontSize: '0.8rem' }}
                      />
                    </Tabs>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: '12px',
                        bgcolor: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 184, 0, 0.3)'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          src={customConfig?.agencyLogoUrl}
                          sx={{
                            width: 36,
                            height: 36,
                            border: '1.5px solid',
                            borderColor: 'primary.main',
                            bgcolor: 'rgba(255, 184, 0, 0.15)',
                            color: 'primary.main',
                            fontWeight: 800,
                            fontSize: '0.85rem'
                          }}
                        >
                          {(customConfig?.agencyName || 'A')[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700} sx={{ color: '#fff', lineHeight: 1.2 }}>
                            {customConfig?.agencyName || 'Sua Assessoria'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem' }}>
                            {customConfig?.agencyTagline || 'Assessoria & Cerimonial'}
                          </Typography>
                        </Box>
                      </Box>

                      {previewTab === 'app' && (
                        <Button
                          size="small"
                          startIcon={<WhatsAppIcon sx={{ fontSize: '16px !important' }} />}
                          variant="contained"
                          sx={{
                            borderRadius: '999px',
                            bgcolor: '#25D366',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': { bgcolor: '#20ba5a', boxShadow: 'none' }
                          }}
                        >
                          Falar no WhatsApp
                        </Button>
                      )}
                    </Box>

                    <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                      {previewTab === 'screen'
                        ? 'No telão do evento, sua marca é exibida com destaque sem botões clicáveis.'
                        : 'No celular dos convidados, o botão de WhatsApp permite iniciar conversa direta com a assessoria.'}
                    </Typography>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Card>

        <Box sx={settingsActionsRowStyles}>
          {isDirty && (
            <Button
              type="button"
              variant="outlined"
              disabled={isSaving}
              onClick={() => setForm(initialForm)}
              sx={settingsButtonStyles}
            >
              Descartar alterações
            </Button>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={!isDirty || isSaving}
            startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon fontSize="small" />}
            sx={settingsButtonStyles}
          >
            {isSaving ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </Box>
      </Card>

      {event.myRole === 'creator' && onDelete && (
        <Card elevation={0} sx={dangerCardStyles}>
          <Box sx={dangerRowStyles}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" component="h2" color="error.main">
                Excluir evento
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                Remove permanentemente o evento, o mural de convidados e todas as fotos enviadas. Esta ação não pode ser desfeita.
              </Typography>
            </Box>

            <Button
              type="button"
              color="error"
              variant="outlined"
              startIcon={<DeleteIcon fontSize="small" />}
              onClick={() => setIsDeleteModalOpen(true)}
              sx={settingsButtonStyles}
            >
              Excluir evento
            </Button>
          </Box>
        </Card>
      )}

      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        variant="danger"
        title="Excluir evento permanentemente?"
        description={
          <>
            Tem certeza que deseja excluir <strong>{event.name}</strong> e todas as fotos registradas? Esta ação não pode ser desfeita.
          </>
        }
        primaryAction={{
          label: isDeleting ? 'Excluindo...' : 'Sim, excluir evento',
          onClick: handleConfirmDelete,
          loading: isDeleting,
          color: 'error'
        }}
        secondaryAction={{
          label: 'Cancelar',
          onClick: () => setIsDeleteModalOpen(false),
          disabled: isDeleting
        }}
      />
    </Box>
  )
}

export default EventSettings
