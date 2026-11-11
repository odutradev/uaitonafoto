import type { Response } from 'express'

export type ResponseErrorsParams =
  | 'bad_request'
  | 'validation_error'
  | 'unauthorized'
  | 'no_token'
  | 'token_is_not_valid'
  | 'forbidden'
  | 'not_found'
  | 'user_not_found'
  | 'conflict'
  | 'too_many_requests'
  | 'internal_error'

export interface ErrorCatalogEntry {
  status: number
  message: string
}

export interface SendErrorParams {
  res: Response
  code: ResponseErrorsParams
  error?: unknown
  details?: unknown
  local?: string
}

