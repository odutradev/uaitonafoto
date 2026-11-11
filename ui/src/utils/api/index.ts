import axios from 'axios'

import { firebaseAuth } from '@utils/functions/firebase'
import useAuthStore from '@stores/auth'
import defaultConfig from '@assets/config'

import type { AxiosInstance } from 'axios'
import type { SyncResponse } from '@utils/types/auth'
import type { QueueItem, RetryConfig } from './types'

const api: AxiosInstance = axios.create({
  baseURL: defaultConfig.baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

let isRefreshing = false
let failedQueue: QueueItem[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token as string)
  })
  failedQueue = []
}

api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState().auth
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryConfig

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const currentUser = firebaseAuth?.currentUser
        if (!currentUser) throw new Error('Sessão expirada')

        const firebaseToken = await currentUser.getIdToken(true)

        const isKnown = (val?: string | null) =>
          !!val && val.trim().length > 0 && val.trim().toLowerCase() !== 'unknown'

        const storedUser = useAuthStore.getState().auth.user
        const resolvedName = isKnown(currentUser.displayName)
          ? currentUser.displayName!.trim()
          : isKnown(storedUser?.name)
            ? storedUser!.name.trim()
            : isKnown(storedUser?.fullName)
              ? storedUser!.fullName!.trim()
              : currentUser.email?.split('@')[0] || 'Usuário'

        const { data } = await axios.post<SyncResponse>(
          `${api.defaults.baseURL}/auth/sync`,
          {
            authProviderId: currentUser.providerData[0]?.providerId ?? 'password',
            name: resolvedName,
            fullName: isKnown(storedUser?.fullName)
              ? storedUser!.fullName
              : resolvedName !== 'Usuário'
                ? resolvedName
                : undefined,
            email: currentUser.email ?? '',
            photoUrl: currentUser.photoURL ?? undefined,
            id: currentUser.uid
          },
          {
            headers: { Authorization: `Bearer ${firebaseToken}` }
          }
        )

        useAuthStore.getState().setToken(data.token)
        useAuthStore.getState().setAuthUser(data.user)

        processQueue(null, data.token)

        originalRequest.headers.Authorization = `Bearer ${data.token}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        useAuthStore.getState().clearAuth()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
