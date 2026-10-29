import { createJSONStorage, persist } from 'zustand/middleware'
import { create } from 'zustand'

import { authStoreDefaultValues } from './defaultValues'

import type { AuthStore } from './types'

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      auth: authStoreDefaultValues,
      setToken: (token) =>
        set((state) => ({
          auth: {
            ...state.auth,
            token
          }
        })),
      setAuthUser: (user) =>
        set((state) => ({
          auth: {
            ...state.auth,
            loading: false,
            user
          }
        })),
      updateUser: (partialUser) =>
        set((state) => ({
          auth: {
            ...state.auth,
            user: state.auth.user
              ? {
                  ...state.auth.user,
                  ...partialUser
                }
              : null
          }
        })),
      setLoading: (loading) =>
        set((state) => ({
          auth: {
            ...state.auth,
            loading
          }
        })),
      clearAuth: () =>
        set({
          auth: {
            ...authStoreDefaultValues,
            loading: false
          }
        })
    }),
    {
      storage: createJSONStorage(() => localStorage),
      name: 'auth-store'
    }
  )
)

export default useAuthStore