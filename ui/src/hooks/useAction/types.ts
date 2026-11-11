export interface ActionToastMessages {
  pending?: string
  success?: string
  error?: string
}

export interface UseActionParams<Result> {
  action: () => Promise<Result>
  toastMessages?: ActionToastMessages
  callback?: (result: Result) => void | Promise<void>
  onError?: (error: unknown) => void
  shouldUseApiError?: boolean
}

export type RunAction = <Result>(params: UseActionParams<Result>) => Promise<Result | undefined>
