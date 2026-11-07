import { Box, Button, Card, CircularProgress, TextField, Typography } from '@mui/material'
import { LockReset as LockResetIcon, SaveOutlined as SaveIcon } from '@mui/icons-material'

import {
  actionButtonStyles,
  actionsRowStyles,
  fieldsGridStyles,
  formCardStyles,
  sectionsStackStyles,
  securityRowStyles
} from './styles'
import type { ProfileDetailsFormProps } from './types'

const ProfileDetailsForm = ({
  email,
  values,
  isDirty,
  isSaving,
  isSendingReset,
  onChangeField,
  onSubmit,
  onReset,
  onSendPasswordReset
}: ProfileDetailsFormProps) => {
  return (
    <Box sx={sectionsStackStyles}>
      <Card component="form" onSubmit={onSubmit} elevation={0} sx={formCardStyles}>
        <Box>
          <Typography variant="h6" component="h2">
            Informações pessoais
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Atualize seus dados básicos de identificação e contato usados nos eventos e recibos.
          </Typography>
        </Box>

        <Box sx={fieldsGridStyles}>
          <TextField
            label="Nome de exibição"
            placeholder="Ex: João"
            value={values.name}
            onChange={(e) => onChangeField('name', e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Nome completo ou assessoria"
            placeholder="Ex: João Silva Eventos"
            value={values.fullName}
            onChange={(e) => onChangeField('fullName', e.target.value)}
            fullWidth
          />

          <TextField
            label="E-mail da conta"
            value={email}
            disabled
            helperText="O e-mail principal é vinculado ao seu login."
            fullWidth
          />

          <TextField
            label="Telefone / WhatsApp"
            placeholder="Ex: 31999999999"
            value={values.phone}
            onChange={(e) => onChangeField('phone', e.target.value)}
            fullWidth
          />
        </Box>

        <TextField
          label="URL da foto de perfil (opcional)"
          placeholder="https://..."
          value={values.photoUrl}
          onChange={(e) => onChangeField('photoUrl', e.target.value)}
          fullWidth
        />

        <Box sx={actionsRowStyles}>
          {isDirty && (
            <Button
              type="button"
              variant="outlined"
              disabled={isSaving}
              onClick={onReset}
              sx={actionButtonStyles}
            >
              Descartar alterações
            </Button>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isDirty || isSaving}
            startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            sx={actionButtonStyles}
          >
            {isSaving ? 'Salvando...' : 'Salvar informações'}
          </Button>
        </Box>
      </Card>

      <Card component="section" elevation={0} sx={formCardStyles}>
        <Box sx={securityRowStyles}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" component="h2">
              Segurança e senha
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Deseja cadastrar ou alterar sua senha de acesso? Enviaremos um link seguro para o seu e-mail.
            </Typography>
          </Box>

          <Button
            type="button"
            variant="outlined"
            disabled={isSendingReset}
            onClick={onSendPasswordReset}
            startIcon={isSendingReset ? <CircularProgress size={18} color="inherit" /> : <LockResetIcon />}
            sx={actionButtonStyles}
          >
            {isSendingReset ? 'Enviando e-mail...' : 'Redefinir senha'}
          </Button>
        </Box>
      </Card>
    </Box>
  )
}

export default ProfileDetailsForm
