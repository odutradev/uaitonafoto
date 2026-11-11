import type { InternalAxiosRequestConfig } from 'axios'

export interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export interface QueueItem {
  resolve: (token: string) => void
  reject: (err: unknown) => void
}
