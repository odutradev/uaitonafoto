import { emailBlocks } from '@email/builder/blocks'
import { enrichEmail } from '@email/utils'

import type { PaymentExpiredEmailVariables } from './types'

const paymentExpiredEmail = enrichEmail<PaymentExpiredEmailVariables>({
  subject: ({ planName }) => `Pagamento expirado: ${planName} - uai to na foto`,
  build: ({ userName, planName, amountFormatted, billingUrl }) => ({
    preheader: 'O prazo do seu pagamento acabou e nenhum valor foi cobrado.',
    eyebrow: 'Pagamento expirado',
    title: 'Seu pagamento expirou',
    blocks: [
      emailBlocks.paragraph(`Olá, **${userName}**!`),
      emailBlocks.paragraph(`O prazo para pagar **${planName}** (${amountFormatted}) terminou antes da confirmação, então o pedido foi cancelado. **Nenhum valor foi cobrado.**`),
      emailBlocks.paragraph('Se ainda quiser os créditos, é só gerar um novo pagamento. Leva menos de um minuto.'),
      emailBlocks.button('Gerar novo pagamento', billingUrl)
    ]
  })
})

export default paymentExpiredEmail
