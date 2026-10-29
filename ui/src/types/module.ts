import type { RouteObject } from 'react-router-dom'
import type { ReactNode } from 'react'

export type AppRoute = RouteObject & {
  permissionCodes?: string[]
  children?: AppRoute[]
  global?: boolean
  auth?: boolean
}

export type MenuItem = {
  permissionCodes?: string[]
  children?: MenuItem[]
  global?: boolean
  icon?: ReactNode
  label: string
  path: string
}

export type AppModule = {
  onStartup?: () => Promise<void>
  menuItems?: MenuItem[]
  routes?: AppRoute[]
  id: string
}