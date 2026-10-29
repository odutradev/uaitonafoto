import { createJSONStorage, persist } from 'zustand/middleware'
import { create } from 'zustand'

import { systemStoreDefaultValues } from './defaultValues'

import type { SystemStore } from './types'

const useSystemStore = create<SystemStore>()(
  persist(
    (set) => ({
      system: systemStoreDefaultValues,
      setSystem: (system) => set({ system }),
      updateSystem: (partialSystem) =>
        set((state) => ({
          system: {
            ...state.system,
            ...partialSystem
          }
        })),
      setLoading: (currentLoading) =>
        set((state) => ({
          system: {
            ...state.system,
            loading: currentLoading ?? !state.system.loading
          }
        })),
      toggleSidebar: () =>
        set((state) => ({
          system: {
            ...state.system,
            sidebarOpen: !state.system.sidebarOpen
          }
        })),
      toggleTheme: () =>
        set((state) => ({
          system: {
            ...state.system,
            themeMode: state.system.themeMode === 'light' ? 'dark' : 'light'
          }
        })),
      reset: () => {
        set({ system: systemStoreDefaultValues })
        localStorage.removeItem('system-store')
      }
    }),
    {
      storage: createJSONStorage(() => localStorage),
      name: 'system-store'
    }
  )
)

export default useSystemStore