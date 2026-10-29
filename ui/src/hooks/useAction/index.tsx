import { toast } from 'react-toastify'

import { defaultToastMessages } from '@config/toastConfig'

import type { UseActionProps } from './types'

const useAction = async ({ toastMessages, callback, onError, action, silent }: UseActionProps): Promise<void> => {
  const send = async () => {
    const result = await action()
    if (result && typeof result === 'object' && 'error' in result) {
      throw new Error(result.error)
    }
    if (callback) setTimeout(() => callback(result), 500)
  }

  if (silent) {
    try {
      await send()
    } catch (error) {
      if (onError && error instanceof Error) onError(error)
      throw error
    }
    return
  }

  const mergedToastMessages = { ...defaultToastMessages, ...toastMessages }

  try {
    await toast.promise(send(), mergedToastMessages)
  } catch (error) {
    if (onError && error instanceof Error) onError(error)
    throw error
  }
}

export default useAction