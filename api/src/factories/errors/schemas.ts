import { z } from 'zod'

export const errorResponseSchema = z.object({
  error: z.string().describe('Código identificador do erro'),
  message: z.string().describe('Mensagem descritiva do erro'),
  details: z.unknown().optional().describe('Detalhes adicionais ou erros de validação')
})

export default errorResponseSchema
