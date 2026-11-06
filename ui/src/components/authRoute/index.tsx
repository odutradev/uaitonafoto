import { Navigate, Outlet, useLocation } from 'react-router-dom'

import useAuthStore from '@stores/auth'

import type { AuthRouteProps } from './types'

const PRIVATE_FALLBACK = '/signin'
const GUEST_FALLBACK = '/app'

const AuthRoute = ({ access }: AuthRouteProps) => {
  const isAuthenticated = useAuthStore((state) => Boolean(state.auth.user))
  const location = useLocation()

  if (access === 'private' && !isAuthenticated) {
    return <Navigate to={PRIVATE_FALLBACK} replace />
  }

  if (access === 'guest' && isAuthenticated) {
    const searchParams = new URLSearchParams(location.search)
    const planId = searchParams.get('planId') || searchParams.get('productId')
    const destination = planId ? `/app?checkout=${encodeURIComponent(planId)}` : GUEST_FALLBACK
    return <Navigate to={destination} replace />
  }

  return <Outlet />
}

export default AuthRoute

