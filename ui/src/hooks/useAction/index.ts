import { useCallback } from 'react'
import { toast } from 'react-toastify'

import { getErrorMessage } from '@utils/functions/events'

import type { RunAction, UseActionParams } from './types'

export const runAction = async <Result>({
  action,
  toastMessages = {},
  callback,
  onError,
  shouldUseApiError = true
}: UseActionParams<Result>): Promise<Result | undefined> => {
  const pendingToastId = toastMessages.pending ? toast.loading(toastMessages.pending) : null

  try {
    const result = await action()
    if (pendingToastId !== null) toast.dismiss(pendingToastId)
    if (toastMessages.success) toast.success(toastMessages.success)
    await callback?.(result)
    return result
  } catch (error) {
    if (pendingToastId !== null) toast.dismiss(pendingToastId)
    if (toastMessages.error) {
      toast.error(shouldUseApiError ? getErrorMessage(error, toastMessages.error) : toastMessages.error)
    }
    onError?.(error)
    return undefined
  }
}

const useAction = (): RunAction => useCallback(<Result>(params: UseActionParams<Result>) => runAction(params), [])

export default useAction
