export interface ToastMessages {
  pending: string
  success: string
  error: string
}

export interface UseActionProps<TData = unknown> {
  toastMessages?: Partial<ToastMessages>
  onError?: (error: Error) => void
  action: () => Promise<TData>
  callback?: (data: TData) => unknown
  silent?: boolean
}
