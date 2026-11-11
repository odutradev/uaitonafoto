import { createHash, randomBytes } from 'crypto'

import createLogger from '@utils/logger'

const logger = createLogger('webhookSecret')

const printCustomSecret = (customInput: string) => {
  const sha256Hash = createHash('sha256').update(customInput).digest('hex')
  const base64Hash = createHash('sha256').update(customInput).digest('base64')

  logger.clean(`Entrada fornecida: "${customInput}"\n`)
  logger.clean('1. Hash SHA-256 (Hex):')
  logger.clean(`   ${sha256Hash}\n`)
  logger.clean('2. Hash SHA-256 (Padrão whsec_):')
  logger.clean(`   whsec_${base64Hash}\n`)
}

const printGeneratedSecrets = () => {
  const standardSecret = `whsec_${randomBytes(24).toString('base64')}`
  const sha256Secret = createHash('sha256').update(randomBytes(32)).digest('hex')

  logger.clean('✅ RECOMENDADO (Padrão Oficial AbacatePay / Standard Webhooks):')
  logger.clean(`👉  ${standardSecret}\n`)
  logger.clean('Opção Alternativa (Hash Hexadecimal SHA-256 puro):')
  logger.clean(`👉  ${sha256Secret}\n`)
}

const main = () => {
  const args = process.argv.slice(2).filter((arg) => !arg.startsWith('--'))
  const customInput = args[0]

  logger.clean('\n🥑 ==========================================')
  logger.clean('   GERADOR DE WEBHOOK SECRET (ABACATEPAY)')
  logger.clean('==========================================\n')

  if (customInput) printCustomSecret(customInput)
  if (!customInput) printGeneratedSecrets()

  logger.clean('📌 ONDE CONFIGURAR:')
  logger.clean('  1. No painel do AbacatePay > Webhooks > Campo "Secret" (ou Segredo)')
  logger.clean('  2. No arquivo .env da sua API:')
  logger.clean('     ABACATEPAY_WEBHOOK_SECRET=<o_token_gerado_acima>\n')
}

main()
