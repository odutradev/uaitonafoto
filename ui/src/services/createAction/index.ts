import axios from 'axios'

import defaultConfig from '@config/default'

import type { ActionResponse, CreateActionParams } from './types'

const createAction = <TArgs extends unknown[], TReturn>({ name, action, log }: CreateActionParams<TArgs, TReturn>) => {
  return async (...args: TArgs): Promise<ActionResponse<TReturn>> => {
    try {
      return await action(...args)
    } catch (error) {
      if (log || defaultConfig.mode === 'developing') {
        console.log(`[${name}] Error:`, error)
      }
      if (axios.isAxiosError(error) && error.response) return { error: error.response.data.message || 'Erro desconhecido' }
      if (error instanceof Error) return { error: error.message }
      return { error: 'Erro na requisição' }
    }
  }
}

export default createAction