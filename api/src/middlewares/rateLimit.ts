import rateLimit from 'express-rate-limit'
import sendError from '@error'

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: (req) => req.path.startsWith('/docs') || req.path.startsWith('/api/docs'),
  handler: (_req, res) => {
    sendError({
      res,
      code: 'too_many_requests',
      details: 'Limite geral de requisições excedido. Por favor, aguarde alguns minutos antes de tentar novamente.'
    })
  }
})

export const authRateLimiter = rateLimit({
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
})
