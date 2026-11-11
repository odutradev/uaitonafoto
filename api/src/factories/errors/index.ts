import createLogger from '@utils/logger'

import type { ErrorCatalogEntry, ResponseErrorsParams, SendErrorParams } from './types'

const ErrorCatalog: Record<ResponseErrorsParams, ErrorCatalogEntry> = {
  bad_request: { status: 400, message: 'Requisição inválida.' },
  validation_error: { status: 400, message: 'Dados inválidos na requisição.' },
  unauthorized: { status: 401, message: 'Não autorizado.' },
  no_token: { status: 401, message: 'Token de autenticação não fornecido.' },
  token_is_not_valid: { status: 401, message: 'Token de autenticação inválido ou expirado.' },
  forbidden: { status: 403, message: 'Acesso negado.' },
  not_found: { status: 404, message: 'Recurso não encontrado.' },
  user_not_found: { status: 404, message: 'Usuário não encontrado.' },
  conflict: { status: 409, message: 'Conflito ao processar o recurso.' },
  too_many_requests: { status: 429, message: 'Muitas requisições. Tente novamente em instantes.' },
  internal_error: { status: 500, message: 'Erro interno do servidor.' }
}

const sendError = ({ res, code, error, details, local }: SendErrorParams): void => {
  if (res.headersSent) return

  const entry = ErrorCatalog[code] ?? ErrorCatalog.internal_error

  const isServerError = entry.status >= 500
  if (isServerError) createLogger(local || 'error').error(entry.message, error ?? details ?? '')
  if (!isServerError && error) createLogger(local || 'error').warn(`${code}: ${entry.message}`, error)

  res.status(entry.status).json({
    error: code,
    message: typeof details === 'string' ? details : entry.message,
    ...(details !== undefined ? { details } : {})
  })
}

export default sendError

