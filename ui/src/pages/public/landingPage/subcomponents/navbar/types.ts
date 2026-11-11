import type { HeaderData } from '@pages/public/landingPage/data'
import type { AuthUser } from '@stores/auth/types'

export interface NavbarProps {
  data: HeaderData
  isDark: boolean
  user: AuthUser | null
}

