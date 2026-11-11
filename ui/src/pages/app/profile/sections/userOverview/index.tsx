import { Avatar, Box, Card, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import { ContentCopy as CopyIcon } from "@mui/icons-material";
import { toast } from "react-toastify";

import useProfilePage from "@pages/app/profile/hook";
import useSystemStore from "@stores/system";

import {
  avatarIdentityGroupStyles,
  badgesRowStyles,
  ellipsisStyles,
  idCopyRowStyles,
  identityRowStyles,
  identityTextBoxStyles,
  largeAvatarStyles,
  metaItemBoxStyles,
  metadataGridStyles,
  overviewCardStyles
} from "./styles";
import type { AuthUser } from "@stores/auth/types";

const formatDatePtBr = (isoDate?: string): string => {
  if (!isoDate) return "Não informado";
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return "Não informado";
  return parsed.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

const formatProviderLabel = (provider?: string): string => {
  if (!provider) return "E-mail e senha";
  if (provider.includes("google")) return "Google OAuth";
  if (provider === "password") return "E-mail e senha";
  return provider;
};

const UserOverview = () => {
  const user = useProfilePage().user as AuthUser;
  const displayName = user.fullName || user.name;
  const hasPermissions = useSystemStore((state) => state.hasPermissions);
  const isAdmin = hasPermissions(user.role, ["manage_platform"]);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(user.id);
      toast.info("ID do usuário copiado!");
    } catch {
      toast.error("Não foi possível copiar o identificador.");
    }
  };

  return (
    <Card component="section" elevation={0} sx={overviewCardStyles}>
      <Box sx={identityRowStyles}>
        <Box sx={avatarIdentityGroupStyles}>
          <Avatar src={user.photoUrl} alt={displayName} sx={largeAvatarStyles}>
            {displayName.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={identityTextBoxStyles}>
            <Typography variant="h5" component="h2" sx={ellipsisStyles}>
              {displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={ellipsisStyles}>
              {user.email}
            </Typography>

            <Box sx={badgesRowStyles}>
              <Chip
                size="small"
                color={isAdmin ? "secondary" : "primary"}
                label={isAdmin ? "Administrador" : "Conta ativa"}
                sx={{ fontWeight: 700 }}
              />
              <Chip size="small" variant="outlined" label={`Acesso via ${formatProviderLabel(user.authProviderId)}`} />
              {user.phone && <Chip size="small" variant="outlined" label={`Tel: ${user.phone}`} />}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={metadataGridStyles}>
        <Box sx={metaItemBoxStyles}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            IDENTIFICADOR DA CONTA
          </Typography>
          <Box sx={idCopyRowStyles}>
            <Typography variant="body2" fontWeight={700} sx={ellipsisStyles}>
              {user.id}
            </Typography>
            <Tooltip title="Copiar ID">
              <IconButton size="small" onClick={handleCopyId} aria-label="Copiar ID do usuário">
                <CopyIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={metaItemBoxStyles}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            MEMBRO DESDE
          </Typography>
          <Typography variant="body2" fontWeight={700}>
            {formatDatePtBr(user.createdAt)}
          </Typography>
        </Box>

        <Box sx={metaItemBoxStyles}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            CRÉDITOS DISPONÍVEIS
          </Typography>
          <Typography variant="body2" fontWeight={700}>
            {user.paidCredits} {user.paidCredits === 1 ? "pago" : "pagos"} • {user.freeCredits} grátis
          </Typography>
        </Box>

        <Box sx={metaItemBoxStyles}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            TESTE GRÁTIS
          </Typography>
          <Typography variant="body2" fontWeight={700}>
            {user.freeTrialClaimedAt
              ? `Resgatado em ${formatDatePtBr(user.freeTrialClaimedAt)}`
              : "Disponível para resgate"}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default UserOverview;
