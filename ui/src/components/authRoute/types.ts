export type AuthRouteAccess = 'private' | 'guest' | 'admin'

export interface AuthRouteProps {
  access: AuthRouteAccess
}

