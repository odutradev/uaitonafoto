import { useEffect, useRef, useState } from "react";
import { Avatar, Box, Button, Chip, Container, Drawer, IconButton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  AdminPanelSettingsOutlined as AdminIcon,
  ArrowForwardIos as ArrowIcon,
  Close as CloseIcon,
  HistoryOutlined as LogsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  PaletteOutlined as PaletteIcon,
  PhotoCameraOutlined as EventsIcon,
  ReceiptLongOutlined as BillingIcon
} from "@mui/icons-material";
import { Link as RouterLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

import Logo from "@components/logo";
import ThemeToggle from "@components/themeToggle";
import useAuth from "@hooks/useAuth";
import useSystemStore from "@stores/system";

import {
  adminBadgeStyles,
  creditsLabelRowStyles,
  creditsValueRowStyles,
  ellipsisTextStyles,
  getCreditsBannerStyles,
  getDesktopSidebarStyles,
  getMobileDrawerPaperStyles,
  getMobileTopBarStyles,
  getNavButtonStyles,
  getUserSummaryRowStyles,
  layoutRootStyles,
  logoutButtonStyles,
  mainAreaStyles,
  mainContainerStyles,
  mobileBrandLinkStyles,
  mobileMenuButtonStyles,
  navListStyles,
  sidebarFooterStyles,
  sidebarHeaderStyles,
  sidebarInnerStyles,
  userAvatarStyles,
  userTextBoxStyles
} from "./styles";
import type { DashboardNavItem, SidebarContentProps } from "./types";

const SidebarContent = ({
  isDark,
  currentPath,
  userName,
  userEmail,
  userPhotoUrl,
  isAdmin,
  hasActiveSubscription = false,
  paidCredits,
  freeCredits,
  onNavigate,
  onLogout
}: SidebarContentProps) => {
  const navItems: DashboardNavItem[] = [
    {
      label: "Meus eventos",
      path: "/app",
      icon: <EventsIcon fontSize="small" />,
      exact: true,
      matchPrefixes: ["/app/events"]
    },
    ...(hasActiveSubscription
      ? [{ label: "Personalização", path: "/app/customization", icon: <PaletteIcon fontSize="small" /> }]
      : []),
    { label: "Plano e transações", path: "/app/billing", icon: <BillingIcon fontSize="small" /> },
    { label: "Logs de atividade", path: "/app/logs", icon: <LogsIcon fontSize="small" /> },
    ...(isAdmin ? [{ label: "Gestão geral", path: "/app/admin", icon: <AdminIcon fontSize="small" /> }] : [])
  ];

  return (
    <Box sx={sidebarInnerStyles}>
      <Box sx={sidebarHeaderStyles}>
        <RouterLink
          to="/app"
          onClick={() => onNavigate("/app")}
          style={{ textDecoration: "none", display: "inline-flex" }}
        >
          <Logo size="small" variant="auto" />
        </RouterLink>
        <ThemeToggle />
      </Box>

      <Box
        role="button"
        tabIndex={0}
        onClick={() => onNavigate("/app/billing")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onNavigate("/app/billing");
          }
        }}
        sx={getCreditsBannerStyles(isDark)}
      >
        <Box sx={creditsLabelRowStyles}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            SALDO DISPONÍVEL
          </Typography>
          <ArrowIcon sx={{ fontSize: 12, color: "text.secondary" }} />
        </Box>
        <Box sx={creditsValueRowStyles}>
          <Typography variant="h6" component="span" fontWeight={800}>
            {paidCredits} {paidCredits === 1 ? "crédito" : "créditos"}
          </Typography>
          {freeCredits > 0 && (
            <Chip size="small" color="primary" label={`+${freeCredits} grátis`} sx={{ fontWeight: 700, height: 22 }} />
          )}
        </Box>
      </Box>

      <Box component="nav" aria-label="Menu principal da dashboard" sx={navListStyles}>
        {navItems.map((item) => {
          const isDirectMatch = item.exact
            ? currentPath === item.path
            : currentPath === item.path || currentPath.startsWith(`${item.path}/`);
          const isPrefixMatch = Boolean(
            item.matchPrefixes?.some((prefix) => currentPath === prefix || currentPath.startsWith(`${prefix}/`))
          );
          const isActive = isDirectMatch || isPrefixMatch;

          return (
            <Button
              key={item.path}
              fullWidth
              disableElevation
              startIcon={item.icon}
              onClick={() => onNavigate(item.path)}
              sx={getNavButtonStyles(isActive, isDark)}
            >
              {item.label}
            </Button>
          );
        })}
      </Box>

      <Box sx={sidebarFooterStyles}>
        <Box
          role="button"
          tabIndex={0}
          aria-label="Acessar meu perfil"
          onClick={() => onNavigate("/app/profile")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onNavigate("/app/profile");
            }
          }}
          sx={getUserSummaryRowStyles(
            currentPath === "/app/profile" || currentPath.startsWith("/app/profile/"),
            isDark
          )}
        >
          <Avatar src={userPhotoUrl} alt={userName} sx={userAvatarStyles}>
            {userName.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={userTextBoxStyles}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Typography variant="subtitle2" fontWeight={700} sx={ellipsisTextStyles}>
                {userName}
              </Typography>
              {isAdmin && <Chip size="small" color="secondary" label="Admin" sx={adminBadgeStyles} />}
            </Stack>
            <Typography variant="caption" color="text.secondary" component="p" sx={ellipsisTextStyles}>
              {userEmail}
            </Typography>
          </Box>
        </Box>

        <Button
          fullWidth
          variant="text"
          startIcon={<LogoutIcon fontSize="small" />}
          onClick={onLogout}
          sx={logoutButtonStyles}
        >
          Sair da conta
        </Button>
      </Box>
    </Box>
  );
};

const DashboardLayout = () => {
  const hasPermissions = useSystemStore((state) => state.hasPermissions);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  if (!user) return null;

  const searchParams = new URLSearchParams(location.search);
  if (location.pathname === "/app" && (searchParams.has("checkout") || searchParams.has("payment"))) {
    return <Navigate to={`/app/billing${location.search}`} replace />;
  }

  const handleNavigate = (path: string) => {
    setMobileOpen(false);
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
  };

  const sidebarProps: SidebarContentProps = {
    isDark,
    currentPath: location.pathname,
    userName: user.fullName || user.name,
    userEmail: user.email,
    userPhotoUrl: user.photoUrl,
    isAdmin: hasPermissions(user.role, ["manage_platform"]),
    hasActiveSubscription: Boolean(user.hasActiveSubscription),
    paidCredits: user.paidCredits,
    freeCredits: user.freeCredits,
    onNavigate: handleNavigate,
    onLogout: handleLogout
  };

  return (
    <Box sx={layoutRootStyles}>
      <Box component="header" sx={getMobileTopBarStyles(isDark)}>
        <IconButton onClick={() => setMobileOpen(true)} aria-label="Abrir menu lateral" sx={mobileMenuButtonStyles}>
          <MenuIcon />
        </IconButton>

        <Box component={RouterLink} to="/app" sx={mobileBrandLinkStyles}>
          <Logo size="small" variant="auto" />
        </Box>

        <ThemeToggle />
      </Box>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", md: "none" } }}
        slotProps={{ paper: { sx: getMobileDrawerPaperStyles(isDark) } }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1, pr: 1 }}>
          <IconButton onClick={() => setMobileOpen(false)} aria-label="Fechar menu lateral" sx={mobileMenuButtonStyles}>
            <CloseIcon />
          </IconButton>
        </Box>
        <SidebarContent {...sidebarProps} />
      </Drawer>

      <Box component="aside" sx={getDesktopSidebarStyles(isDark)}>
        <SidebarContent {...sidebarProps} />
      </Box>

      <Box ref={mainRef} component="main" sx={mainAreaStyles}>
        <Container maxWidth="lg" sx={mainContainerStyles}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
