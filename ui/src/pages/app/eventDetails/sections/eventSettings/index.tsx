import { useEffect, useState } from "react";
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
} from "@mui/material";
import {
  DeleteOutline as DeleteIcon,
  DesktopWindowsOutlined as ScreenIcon,
  PhoneIphoneOutlined as MobileIcon,
  SaveOutlined as SaveIcon,
  Chat as WhatsAppIcon,
  SyncOutlined as SyncIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import EventFormFields, {
  isValidEventPeriod,
  isValidEventPin,
  toEventForm,
  toEventPayload
} from "@components/eventFormFields";
import { isEventStarted } from "@utils/functions/eventPhase";
import Modal from "@components/modal";
import useAuth from "@hooks/useAuth";

import {
  appBadgeCardStyles,
  appMockupStyles,
  appNotchBarStyles,
  customizationCardStyles,
  customizationSwitchRowStyles,
  dangerCardStyles,
  dangerRowStyles,
  previewBoxStyles,
  previewTabsContainerStyles,
  proBadgeStyles,
  screenBadgeStyles,
  screenHeaderBarStyles,
  screenMockupStyles,
  settingsActionsRowStyles,
  settingsButtonStyles,
  settingsCardStyles,
  settingsSectionStackStyles,
  syncButtonStyles
} from "./styles";
import type { FormEvent } from "react";
import type { EventFormState } from "@components/eventFormFields/types";
import type { EventCustomization } from "@utils/types/events";
import useEventDetailsPage from "@pages/app/eventDetails/hook";

const EventSettings = () => {
  const { event: eventValue, save: onSave, remove: onDelete } = useEventDetailsPage();
  const event = eventValue!;

  const navigate = useNavigate();
  const { user } = useAuth();
  const hasPlan = Boolean(user?.hasActiveSubscription);

  const initialForm = toEventForm(event);
  const [form, setForm] = useState<EventFormState>(() => initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewTab, setPreviewTab] = useState<"screen" | "app">("screen");

  useEffect(() => {
    setForm(toEventForm(event));
  }, [event]);

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm);

  const setField = <K extends keyof EventFormState>(key: K, value: EventFormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const updateCustomization = (patch: Partial<EventCustomization>) => {
    setForm((current) => {
      const existing = current.customization ?? {
        enabled: true,
        agencyName: "",
        agencyLogoUrl: "",
        agencyWhatsapp: "",
        agencyTagline: "Assessoria & Cerimonial",
        whatsappMessage: "Olá! Vi a marca de vocês no evento e gostaria de mais informações.",
        primaryColor: "#FFD21F"
      };
      return {
        ...current,
        customization: {
          ...existing,
          ...patch
        }
      };
    });
  };

  const handleApplyAgencyDefaults = () => {
    if (!user?.customization) {
      toast.info("Nenhuma personalização global configurada ainda.");
      return;
    }
    setForm((current) => ({
      ...current,
      customization: {
        ...user.customization,
        enabled: true
      }
    }));
    toast.success("Dados da agência aplicados ao evento!");
  };

  const handleSubmit = async (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();

    if (!isValidEventPeriod(form)) {
      toast.error("O término do evento deve ser depois do início.");
      return;
    }

    if (!isValidEventPin(form)) {
      toast.error("O PIN de acesso deve ter exatamente 4 dígitos numéricos.");
      return;
    }

    const payload = toEventPayload(form);
    if (isEventStarted(event.startsAt)) {
      payload.startsAt = event.startsAt;
    }

    setIsSaving(true);
    await onSave(payload);
    setIsSaving(false);
  };

  const handleConfirmDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    await onDelete();
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
  };

  const customConfig = form.customization;
  const isCustomEnabled = Boolean(customConfig?.enabled);

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
          <Box
            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}
          >
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                <Button color="inherit" size="small" onClick={() => navigate("/app/billing")} sx={syncButtonStyles}>
                  Ver planos
                </Button>
              }
              sx={{ borderRadius: "10px" }}
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
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2
                    }}
                  >
                    <TextField
                      size="small"
                      label="Nome da Assessoria / Cerimonial"
                      placeholder="Ex: Cerimonial Real & Eventos"
                      value={customConfig?.agencyName ?? ""}
                      onChange={(e) => updateCustomization({ agencyName: e.target.value })}
                      fullWidth
                    />
                    <TextField
                      size="small"
                      label="Tagline / Slogan"
                      placeholder="Ex: Assessoria & Organização de Casamentos"
                      value={customConfig?.agencyTagline ?? ""}
                      onChange={(e) => updateCustomization({ agencyTagline: e.target.value })}
                      fullWidth
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2
                    }}
                  >
                    <TextField
                      size="small"
                      label="URL do Logotipo (quadrado ou ícone)"
                      placeholder="https://..."
                      value={customConfig?.agencyLogoUrl ?? ""}
                      onChange={(e) => updateCustomization({ agencyLogoUrl: e.target.value })}
                      fullWidth
                    />
                    <TextField
                      size="small"
                      label="WhatsApp para Contato (DDD + Número)"
                      placeholder="Ex: 31999998888"
                      value={customConfig?.agencyWhatsapp ?? ""}
                      onChange={(e) => updateCustomization({ agencyWhatsapp: e.target.value })}
                      fullWidth
                      helperText="Somente números com DDD"
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2
                    }}
                  >
                    <TextField
                      size="small"
                      label="Mensagem inicial do WhatsApp (opcional)"
                      placeholder="Mensagem pré-preenchida que o cliente enviará ao clicar no botão..."
                      value={customConfig?.whatsappMessage ?? ""}
                      onChange={(e) => updateCustomization({ whatsappMessage: e.target.value })}
                      fullWidth
                      multiline
                      rows={3}
                    />

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                          component="input"
                          type="color"
                          value={customConfig?.primaryColor || "#FFD21F"}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateCustomization({ primaryColor: e.target.value })
                          }
                          sx={{
                            width: 44,
                            height: 40,
                            p: 0.5,
                            borderRadius: "8px",
                            border: 1,
                            borderColor: "divider",
                            cursor: "pointer",
                            bgcolor: "background.paper",
                            "&::-webkit-color-swatch-wrapper": { p: 0 },
                            "&::-webkit-color-swatch": { borderRadius: "6px", border: "none" }
                          }}
                        />
                        <TextField
                          size="small"
                          label="Cor de destaque do selo / badge"
                          placeholder="#FFD21F"
                          value={customConfig?.primaryColor ?? ""}
                          onChange={(e) => updateCustomization({ primaryColor: e.target.value })}
                          fullWidth
                          helperText="Cor da borda e detalhes do selo da assessoria no telão"
                        />
                      </Box>

                      {/* Paleta rápida de sugestões */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap", pt: 0.5 }}>
                        <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.72rem" }}>
                          Sugestões:
                        </Typography>
                        {[
                          { name: "Dourado", hex: "#FFD21F" },
                          { name: "Ouro Real", hex: "#F59E0B" },
                          { name: "Rosa", hex: "#EC4899" },
                          { name: "Esmeralda", hex: "#10B981" },
                          { name: "Roxo", hex: "#8B5CF6" },
                          { name: "Azul", hex: "#3B82F6" },
                          { name: "Branco", hex: "#FFFFFF" }
                        ].map((preset) => {
                          const isSelected =
                            (customConfig?.primaryColor || "").toLowerCase() === preset.hex.toLowerCase();
                          return (
                            <Chip
                              key={preset.hex}
                              label={preset.name}
                              size="small"
                              onClick={() => updateCustomization({ primaryColor: preset.hex })}
                              sx={{
                                height: 22,
                                fontSize: "0.68rem",
                                cursor: "pointer",
                                borderColor: isSelected ? preset.hex : "divider",
                                borderWidth: 1,
                                borderStyle: "solid",
                                bgcolor: isSelected ? `${preset.hex}22` : "transparent",
                                "&:hover": {
                                  bgcolor: `${preset.hex}33`
                                }
                              }}
                              avatar={
                                <Box
                                  sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    bgcolor: preset.hex,
                                    border: "1px solid rgba(0,0,0,0.2)",
                                    ml: "4px !important"
                                  }}
                                />
                              }
                            />
                          );
                        })}
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={previewBoxStyles}>
                    <Box sx={previewTabsContainerStyles}>
                      <Tabs
                        value={previewTab}
                        onChange={(_, val) => setPreviewTab(val)}
                        variant="fullWidth"
                        sx={{ minHeight: 32 }}
                      >
                        <Tab
                          icon={<ScreenIcon sx={{ fontSize: "0.95rem" }} />}
                          iconPosition="start"
                          label="Prévia no Telão"
                          value="screen"
                          sx={{ minHeight: 32, py: 0.5, textTransform: "none", fontSize: "0.78rem", fontWeight: 700 }}
                        />
                        <Tab
                          icon={<MobileIcon sx={{ fontSize: "0.95rem" }} />}
                          iconPosition="start"
                          label="Prévia no App dos Convidados"
                          value="app"
                          sx={{ minHeight: 32, py: 0.5, textTransform: "none", fontSize: "0.78rem", fontWeight: 700 }}
                        />
                      </Tabs>
                    </Box>

                    {previewTab === "screen" ? (
                      <Box sx={screenMockupStyles}>
                        <Box sx={screenHeaderBarStyles}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: "#EF4444",
                                boxShadow: "0 0 8px #EF4444"
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 800, letterSpacing: "0.06em", color: "#FCD34D" }}
                            >
                              AO VIVO NO TELÃO
                            </Typography>
                          </Box>
                          <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 600 }}>
                            Full HD 1080p
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            ...screenBadgeStyles,
                            border: `1.5px solid ${customConfig?.primaryColor || "rgba(255, 255, 255, 0.25)"}`,
                            boxShadow: customConfig?.primaryColor
                              ? `0 0 16px ${customConfig.primaryColor}40`
                              : "0 4px 16px rgba(0, 0, 0, 0.3)"
                          }}
                        >
                          <Avatar
                            src={customConfig?.agencyLogoUrl}
                            sx={{
                              width: 34,
                              height: 34,
                              border: `2px solid ${customConfig?.primaryColor || "#FFCF1F"}`,
                              bgcolor: customConfig?.primaryColor || "primary.main",
                              color: "primary.contrastText",
                              fontWeight: 800,
                              fontSize: "0.85rem"
                            }}
                          >
                            {(customConfig?.agencyName || "A")[0].toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body2"
                              fontWeight={800}
                              sx={{ color: "#FFFFFF", lineHeight: 1.15, fontSize: "0.85rem" }}
                            >
                              {customConfig?.agencyName || "Sua Assessoria"}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: customConfig?.primaryColor || "#FDE68A",
                                fontSize: "0.7rem",
                                fontWeight: 600
                              }}
                            >
                              {customConfig?.agencyTagline || "Assessoria & Cerimonial"}
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            py: 0.5,
                            opacity: 0.5
                          }}
                        >
                          <Typography variant="caption" sx={{ fontStyle: "italic", color: "#FFFFFF" }}>
                            [ O selo fica fixado no topo da transmissão enquanto as fotos dos convidados passam na tela
                            ]
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={appMockupStyles}>
                        <Box sx={appNotchBarStyles}>
                          <span>21:42</span>
                          <Typography variant="caption" fontWeight={700}>
                            {event.name || "Galeria do Evento"}
                          </Typography>
                          <span>100% 🔋</span>
                        </Box>

                        <Box sx={appBadgeCardStyles}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
                            <Avatar
                              src={customConfig?.agencyLogoUrl}
                              sx={{
                                width: 36,
                                height: 36,
                                border: "1.5px solid",
                                borderColor: "primary.main",
                                bgcolor: "primary.main",
                                color: "primary.contrastText",
                                fontWeight: 800,
                                fontSize: "0.85rem"
                              }}
                            >
                              {(customConfig?.agencyName || "A")[0].toUpperCase()}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="body2" fontWeight={800} sx={{ lineHeight: 1.2 }} noWrap>
                                {customConfig?.agencyName || "Sua Assessoria"}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }} noWrap>
                                {customConfig?.agencyTagline || "Assessoria & Cerimonial"}
                              </Typography>
                            </Box>
                          </Box>

                          <Button
                            size="small"
                            startIcon={<WhatsAppIcon sx={{ fontSize: "15px !important" }} />}
                            variant="contained"
                            sx={{
                              minHeight: 32,
                              px: 1.75,
                              py: 0.5,
                              borderRadius: "8px",
                              bgcolor: "#25D366",
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              textTransform: "none",
                              boxShadow: "0 2px 8px rgba(37, 211, 102, 0.3)",
                              "&:hover": { bgcolor: "#20ba5a" }
                            }}
                          >
                            Falar no WhatsApp
                          </Button>
                        </Box>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ textAlign: "center", fontSize: "0.72rem" }}
                        >
                          No mural do convidado, sua marca fica fixada no topo com botão direto para WhatsApp.
                        </Typography>
                      </Box>
                    )}
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
            {isSaving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </Box>
      </Card>

      {event.myRole === "creator" && (
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
            Tem certeza que deseja excluir <strong>{event.name}</strong> e todas as fotos registradas? Esta ação não
            pode ser desfeita.
          </>
        }
        primaryAction={{
          label: isDeleting ? "Excluindo..." : "Sim, excluir evento",
          onClick: handleConfirmDelete,
          loading: isDeleting,
          color: "error"
        }}
        secondaryAction={{
          label: "Cancelar",
          onClick: () => setIsDeleteModalOpen(false),
          disabled: isDeleting
        }}
      />
    </Box>
  );
};

export default EventSettings;
