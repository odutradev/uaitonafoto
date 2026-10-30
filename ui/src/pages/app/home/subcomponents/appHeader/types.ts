import type { AuthUser } from '@stores/auth/types'

export interface AppHeaderProps {
  user: AuthUser
  isDark: boolean
  onLogout: () => void
}

