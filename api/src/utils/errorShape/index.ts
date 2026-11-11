import type { ErrorShape } from './types'

export const getErrorShape = (error: unknown): ErrorShape => {
  if (typeof error !== 'object' || error === null) return {}
  return error as ErrorShape
}

export default getErrorShape
