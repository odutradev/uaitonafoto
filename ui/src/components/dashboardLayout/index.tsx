import { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Drawer,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  ArrowForwardIos as ArrowIcon,
  Close as CloseIcon,
  HistoryOutlined as LogsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  PersonOutline as ProfileIcon,
  PhotoCameraOutlined as EventsIcon,
  ReceiptLongOutlined as BillingIcon
} from '@mui/icons-material'
import { Link as RouterLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'

import Logo from '@components/logo'
import ThemeToggle from '@components/themeToggle'
import useAuth from '@hooks/useAuth'

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
  userSummaryRowStyles,
  userTextBoxStyles
} from './styles'
import type { DashboardNavItem, SidebarContentProps } from './types'

const NAV_ITEMS: DashboardNavItem[] = [
  { label: 'Meus eventos', path: '/app', icon: <EventsIcon fontSize="small" />, exact: true },
  { label: 'Plano e transações', path: '/app/billing', icon: <BillingIcon fontSize="small" /> },
  { label: 'Meu perfil', path: '/app/profile', icon: <ProfileIcon fontSize="small" /> },
  { label: 'Logs de atividade', path: '/app/logs', icon: <LogsIcon fontSize="small" /> }
]

const SidebarContent = ({
  isDark,
  currentPath,
  userName,
  userEmail,
  userPhotoUrl,
  isAdmin,
  paidCredits,
  freeCredits,
  onNavigate,
  onLogout
}: SidebarContentProps) => {
  return (
    <Box sx={sidebarInnerStyles}>
      <Box sx={sidebarHeaderStyles}>
        <RouterLink to="/app" onClick={() => onNavigate('/app')} style={{ textDecoration: 'none', display: 'inline-flex' }}>
          <Logo size="small" variant="auto" />
        </RouterLink>
        <ThemeToggle />
      </Box>

      <Box
        role="button"
        tabIndex={0}
        onClick={() => onNavigate('/app/billing')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onNavigate('/app/billing')
          }
        }}
        sx={getCreditsBannerStyles(isDark)}
      >
        <Box sx={creditsLabelRowStyles}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            SALDO DISPONÍVEL
          </Typography>
          <ArrowIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
        </Box>
        <Box sx={creditsValueRowStyles}>
          <Typography variant="h6" component="span" fontWeight={800}>
            {paidCredits} {paidCredits === 1 ? 'crédito' : 'créditos'}
          </Typography>
          {freeCredits > 0 && (
            <Chip size="small" color="primary" label={`+${freeCredits} grátis`} sx={{ fontWeight: 700, height: 22 }} />
          )}
        </Box>
      </Box>

      <Box component="nav" aria-label="Menu principal da dashboard" sx={navListStyles}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? currentPath === item.path
            : currentPath === item.path || currentPath.startsWith(`${item.path}/`)

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
          )
        })}
      </Box>

      <Box sx={sidebarFooterStyles}>
        <Box sx={userSummaryRowStyles}>
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
  )
}

const DashboardLayout = () => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!user) return null

  const searchParams = new URLSearchParams(location.search)
  if (location.pathname === '/app' && (searchParams.has('checkout') || searchParams.has('payment'))) {
    return <Navigate to={`/app/billing${location.search}`} replace />
  }

  const handleNavigate = (path: string) => {
    setMobileOpen(false)
    if (location.pathname !== path) {
      navigate(path)
    }
  }

  const handleLogout = () => {
    setMobileOpen(false)
    logout()
  }

  const sidebarProps: SidebarContentProps = {
    isDark,
    currentPath: location.pathname,
    userName: user.fullName || user.name,
    userEmail: user.email,
    userPhotoUrl: user.photoUrl,
    isAdmin: user.role === 'admin',
    paidCredits: user.paidCredits,
    freeCredits: user.freeCredits,
    onNavigate: handleNavigate,
    onLogout: handleLogout
  }

  return (
    <Box sx={layoutRootStyles}>
      <Box component="header" sx={getMobileTopBarStyles(isDark)}>
        <IconButton
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu lateral"
          sx={mobileMenuButtonStyles}
        >
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
        sx={{ display: { xs: 'block', md: 'none' } }}
        slotProps={{ paper: { sx: getMobileDrawerPaperStyles(isDark) } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1, pr: 1 }}>
          <IconButton
            onClick={() => setMobileOpen(false)}
            aria-label="Fechar menu lateral"
            sx={mobileMenuButtonStyles}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <SidebarContent {...sidebarProps} />
      </Drawer>

      <Box component="aside" sx={getDesktopSidebarStyles(isDark)}>
        <SidebarContent {...sidebarProps} />
      </Box>

      <Box component="main" sx={mainAreaStyles}>
        <Container maxWidth="lg" sx={mainContainerStyles}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}

export default DashboardLayout
