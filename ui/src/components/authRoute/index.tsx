import { Navigate, Outlet } from 'react-router-dom'

import useAuthStore from '@stores/auth'

import type { AuthRouteProps } from './types'

const PRIVATE_FALLBACK = '/signin'
const GUEST_FALLBACK = '/app'

const AuthRoute = ({ access }: AuthRouteProps) => {
  const isAuthenticated = useAuthStore((state) => Boolean(state.auth.user))

  if (access === 'private' && !isAuthenticated) {
    return <Navigate to={PRIVATE_FALLBACK} replace />
  }

  if (access === 'guest' && isAuthenticated) {
    return <Navigate to={GUEST_FALLBACK} replace />
  }

  return <Outlet />
}

export default AuthRoute
