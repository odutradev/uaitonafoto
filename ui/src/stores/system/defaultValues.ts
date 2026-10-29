import type { SystemStoreData } from './types'

const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches

export const systemStoreDefaultValues: SystemStoreData = {
  themeMode: isSystemDark ? 'dark' : 'light',
  sidebarOpen: true,
  loading: false
}