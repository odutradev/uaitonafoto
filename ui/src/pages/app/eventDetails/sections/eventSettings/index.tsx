import { useEffect, useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
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
  PhoneIphoneOutlined as MobileIcon,
  SaveOutlined as SaveIcon,
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
  proBadgeStyles,
  settingsActionsRowStyles,
  settingsButtonStyles,
  settingsCardStyles,
  settingsSectionStackStyles,
  syncButtonStyles
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
          <Typography variant="subtitle1" fontWeight={700} component="h2">
            Dados e regras do evento
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Ajuste o nome, tipo, data de início, visibilidade no mural e senha de acesso.
          </Typography>
        </Box>

        <EventFormFields form={form} onChange={setField} isEventStarted={isEventStarted(event.startsAt)} />

        <Box sx={customizationCardStyles}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" fontWeight={700}>
                  Selo White-Label para Cerimonial
                </Typography>
                <Box component="span" sx={proBadgeStyles}>
                  PRO
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Exibe a marca da sua assessoria no topo do telão e no aplicativo dos convidados.
              </Typography>
            </Box>

            {hasPlan && user?.customization && (
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<SyncIcon sx={{ fontSize: 15 }} />}
                onClick={handleApplyAgencyDefaults}
                sx={syncButtonStyles}
              >
                Puxar dados da agência
              </Button>
            )}
          </Box>

          {!hasPlan ? (
            <Alert
              severity="warning"
              action={
                <Button color="inherit" size="small" onClick={() => navigate('/app/billing')} sx={syncButtonStyles}>
                  Ver planos
                </Button>
              }
              sx={{ borderRadius: '10px' }}
            >
              Funcionalidade exclusiva para planos de agência. Assine um plano para personalizar seus eventos.
            </Alert>
          ) : (
            <>
              <Box sx={customizationSwitchRowStyles}>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Ativar neste evento
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Habilita o banner da assessoria no telão e botão de WhatsApp no app dos convidados.
                  </Typography>
                </Box>
                <Switch
                  size="small"
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
                      size="small"
                      label="Nome da Assessoria / Cerimonial"
                      placeholder="Ex: Cerimonial Real & Eventos"
                      value={customConfig?.agencyName ?? ''}
                      onChange={(e) => updateCustomization({ agencyName: e.target.value })}
                      fullWidth
                    />
                    <TextField
                      size="small"
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
                      size="small"
                      label="URL do Logotipo (quadrado ou ícone)"
                      placeholder="https://..."
                      value={customConfig?.agencyLogoUrl ?? ''}
                      onChange={(e) => updateCustomization({ agencyLogoUrl: e.target.value })}
                      fullWidth
                    />
                    <TextField
                      size="small"
                      label="WhatsApp para Contato (DDD + Número)"
                      placeholder="Ex: 31999998888"
                      value={customConfig?.agencyWhatsapp ?? ''}
                      onChange={(e) => updateCustomization({ agencyWhatsapp: e.target.value })}
                      fullWidth
                      helperText="Somente números com DDD"
                    />
                  </Box>

                  <TextField
                    size="small"
                    label="Mensagem inicial do WhatsApp (opcional)"
                    placeholder="Mensagem pré-preenchida que o cliente enviará ao clicar no botão..."
                    value={customConfig?.whatsappMessage ?? ''}
                    onChange={(e) => updateCustomization({ whatsappMessage: e.target.value })}
                    fullWidth
                    multiline
                    rows={2}
                  />

                  <Box sx={previewBoxStyles}>
                    <Tabs
                      value={previewTab}
                      onChange={(_, val) => setPreviewTab(val)}
                      variant="fullWidth"
                      sx={{ borderBottom: 1, borderColor: 'rgba(255, 184, 0, 0.2)', minHeight: 34 }}
                    >
                      <Tab
                        icon={<ScreenIcon sx={{ fontSize: '0.95rem' }} />}
                        iconPosition="start"
                        label="Prévia no Telão"
                        value="screen"
                        sx={{ minHeight: 34, py: 0.5, textTransform: 'none', fontSize: '0.78rem' }}
                      />
                      <Tab
                        icon={<MobileIcon sx={{ fontSize: '0.95rem' }} />}
                        iconPosition="start"
                        label="Prévia no App"
                        value="app"
                        sx={{ minHeight: 34, py: 0.5, textTransform: 'none', fontSize: '0.78rem' }}
                      />
                    </Tabs>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        p: 1.25,
                        borderRadius: '10px',
                        bgcolor: 'rgba(0,0,0,0.6)',
                        border: '1px solid rgba(255, 184, 0, 0.25)'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <Avatar
                          src={customConfig?.agencyLogoUrl}
                          sx={{
                            width: 32,
                            height: 32,
                            border: '1.5px solid',
                            borderColor: 'primary.main',
                            bgcolor: 'rgba(255, 184, 0, 0.15)',
                            color: 'primary.main',
                            fontWeight: 800,
                            fontSize: '0.8rem'
                          }}
                        >
                          {(customConfig?.agencyName || 'A')[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700} sx={{ color: '#fff', lineHeight: 1.2 }}>
                            {customConfig?.agencyName || 'Sua Assessoria'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>
                            {customConfig?.agencyTagline || 'Assessoria & Cerimonial'}
                          </Typography>
                        </Box>
                      </Box>

                      {previewTab === 'app' && (
                        <Button
                          size="small"
                          startIcon={<WhatsAppIcon sx={{ fontSize: '15px !important' }} />}
                          variant="contained"
                          sx={{
                            minHeight: 30,
                            px: 1.5,
                            py: 0.4,
                            borderRadius: '8px',
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
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>

        <Box sx={settingsActionsRowStyles}>
          {isDirty && (
            <Button
              type="button"
              size="small"
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
            size="small"
            variant="contained"
            disabled={!isDirty || isSaving}
            startIcon={isSaving ? <CircularProgress size={15} color="inherit" /> : <SaveIcon sx={{ fontSize: 16 }} />}
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
              <Typography variant="subtitle1" fontWeight={700} component="h2" color="error.main">
                Excluir evento
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                Remove permanentemente o evento, o mural de convidados e todas as fotos enviadas.
              </Typography>
            </Box>

            <Button
              type="button"
              size="small"
              color="error"
              variant="outlined"
              startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
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
