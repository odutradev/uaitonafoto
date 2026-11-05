import rateLimit from 'express-rate-limit'
import sendError from '@error/index'
import { errorResponseSchema } from '@factories/errors/schemas'
import type { RateLimitConfig, DocumentedMiddleware } from './types'

export const createRateLimiter = (config: RateLimitConfig = {}): DocumentedMiddleware => {
  const { domainName, endpointPath, message, ...rest } = config

  const limiter = rateLimit({
    windowMs: rest.windowMs ?? 15 * 60 * 1000,
    limit: rest.limit ?? 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (_req, res) => {
      sendError({
        res,
        code: 'too_many_requests',
        details:
          typeof message === 'string'
            ? message
            : `Limite de requisições excedido${endpointPath ? ` para ${endpointPath}` : domainName ? ` para o domínio ${domainName}` : ''}. Tente novamente mais tarde.`
      })
    },
    ...rest
  })

  return Object.assign(limiter, {
    responses: {
      429: {
        description: 'Muitas requisições. Limite de taxa excedido',
        schema: errorResponseSchema
      }
    }
  })
}

export const globalRateLimiter: DocumentedMiddleware = Object.assign(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: (req) =>
      req.path === '/health' ||
      req.path === '/api/health' ||
      req.path.startsWith('/docs') ||
      req.path.startsWith('/api/docs'),
    handler: (_req, res) => {
      sendError({
        res,
        code: 'too_many_requests',
        details: 'Limite geral de requisições excedido. Por favor, aguarde alguns minutos antes de tentar novamente.'
      })
    }
  }),
  {
    responses: {
      429: {
        description: 'Muitas requisições. Limite geral de taxa excedido',
        schema: errorResponseSchema
      }
    }
  }
)

export const authRateLimiter: DocumentedMiddleware = Object.assign(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (_req, res) => {
      sendError({
        res,
        code: 'too_many_requests',
        details: 'Muitas tentativas de autenticação ou sincronização. Por segurança, tente novamente mais tarde.'
      })
    }
  }),
  {
    responses: {
      429: {
        description: 'Muitas tentativas de autenticação. Limite de taxa excedido',
        schema: errorResponseSchema
      }
    }
  }
)
