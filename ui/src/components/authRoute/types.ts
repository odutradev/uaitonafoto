export type AuthRouteAccess = 'private' | 'guest'

export interface AuthRouteProps {
  access: AuthRouteAccess
}
