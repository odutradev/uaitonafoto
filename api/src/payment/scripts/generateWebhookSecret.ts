import { createHash, randomBytes } from 'crypto'

/**
 * Utilitário CLI para geração de segredo/token de webhook do AbacatePay
 * 
 * Uso:
 *   npm run webhook:secret
 *   npm run webhook:secret -- [seu_token_customizado]
 */
const main = () => {
  const args = process.argv.slice(2).filter((arg) => !arg.startsWith('--'))
  const customInput = args[0]

  console.log('\n🥑 ==========================================')
  console.log('   GERADOR DE WEBHOOK SECRET (ABACATEPAY)')
  console.log('==========================================\n')

  if (customInput) {
    const sha256Hash = createHash('sha256').update(customInput).digest('hex')
    const base64Hash = createHash('sha256').update(customInput).digest('base64')

    console.log(`Entrada fornecida: "${customInput}"\n`)
    console.log('1. Hash SHA-256 (Hex):')
    console.log(`   ${sha256Hash}\n`)
    console.log('2. Hash SHA-256 (Padrão whsec_):')
    console.log(`   whsec_${base64Hash}\n`)
  } else {
    // 1. Padrão oficial Standard Webhooks (whsec_ + 24 bytes base64)
    // Suportado nativamente pelo @abacatepay/types (verifyStandardWebhookSignature)
    const rawBytes = randomBytes(24)
    const standardSecret = `whsec_${rawBytes.toString('base64')}`

    // 2. Hash aleatório SHA-256 em Hexadecimal (32 bytes / 64 chars)
    const sha256Secret = createHash('sha256').update(randomBytes(32)).digest('hex')

    console.log('✅ RECOMENDADO (Padrão Oficial AbacatePay / Standard Webhooks):')
    console.log(`👉  ${standardSecret}\n`)

    console.log('Opção Alternativa (Hash Hexadecimal SHA-256 puro):')
    console.log(`👉  ${sha256Secret}\n`)
  }

  console.log('📌 ONDE CONFIGURAR:')
  console.log('  1. No painel do AbacatePay > Webhooks > Campo "Secret" (ou Segredo)')
  console.log('  2. No arquivo .env da sua API:')
  console.log('     ABACATEPAY_WEBHOOK_SECRET=<o_token_gerado_acima>\n')
}

main()
