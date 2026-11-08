import type { HeaderData } from '../../data'
import type { AuthUser } from '@stores/auth/types'

export interface NavbarProps {
  data: HeaderData
  isDark: boolean
  user: AuthUser | null
}

