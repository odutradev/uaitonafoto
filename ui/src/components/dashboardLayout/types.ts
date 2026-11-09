import type { ReactNode } from 'react'

export interface DashboardNavItem {
  label: string
  path: string
  icon: ReactNode
  exact?: boolean
}

export interface SidebarContentProps {
  isDark: boolean
  currentPath: string
  userName: string
  userEmail: string
  userPhotoUrl?: string
  isAdmin: boolean
  hasActiveSubscription?: boolean
  paidCredits: number
  freeCredits: number
  onNavigate: (path: string) => void
  onLogout: () => void
}
