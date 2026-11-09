import { z } from 'zod'

export const errorResponseSchema = z.object({
  error: z.string().describe('Código identificador do erro'),
  message: z.string().describe('Mensagem descritiva do erro'),
  details: z.unknown().optional().describe('Detalhes adicionais ou erros de validação')
})

export type ErrorResponse = z.infer<typeof errorResponseSchema>

export default errorResponseSchema
