import { emailBlocks } from '@email/builder/blocks'
import { enrichEmail } from '@email/utils'

import type { SubscriptionRenewedEmailVariables } from './types'

const subscriptionRenewedEmail = enrichEmail<SubscriptionRenewedEmailVariables>({
  subject: ({ planName }) => `Renovação confirmada: ${planName} - uaiToNaFoto`,
  build: ({ userName, planName, amountFormatted, creditsAdded, nextBillingDate, appUrl }) => ({
    preheader: `Pagamento confirmado. +${creditsAdded} créditos já estão na sua conta.`,
    eyebrow: 'Assinatura renovada',
    title: 'Seus novos créditos chegaram',
    blocks: [
      emailBlocks.paragraph(`Olá, **${userName}**!`),
      emailBlocks.paragraph(`O pagamento mensal do plano **${planName}** foi confirmado e os novos créditos já estão disponíveis na sua conta.`),
      emailBlocks.details([
        { label: 'Plano', value: planName },
        { label: 'Valor pago', value: amountFormatted },
        { label: 'Créditos adicionados', value: `+${creditsAdded}` },
        { label: 'Próxima renovação', value: nextBillingDate }
      ], 'Resumo da renovação'),
      emailBlocks.paragraph('Acesse o painel para criar eventos e acompanhar seus créditos.'),
      emailBlocks.button('Acessar minha conta', appUrl)
    ]
  })
})

export default subscriptionRenewedEmail
