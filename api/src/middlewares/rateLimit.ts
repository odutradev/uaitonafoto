import rateLimit from 'express-rate-limit'
import sendError from '@/error'

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 300, // Máximo 300 requisições por IP a cada 15 minutos
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
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 20, // Máximo 20 requisições por IP a cada 15 minutos para rotas sensíveis de autenticação
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

export const joinSweepstakeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 30, // Máximo 30 requisições por IP a cada 15 minutos para participação e upload de comprovante
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError({
      res,
      code: 'too_many_requests',
      details: 'Limite de solicitações de participação excedido. Por favor, aguarde alguns instantes.'
    })
  }
})
