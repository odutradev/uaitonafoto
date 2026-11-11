import { emailBlocks } from '@email/builder/blocks'
import { enrichEmail } from '@email/utils'

import type { SubscriptionCancelledEmailVariables } from './types'

const subscriptionCancelledEmail = enrichEmail<SubscriptionCancelledEmailVariables>({
  subject: ({ planName }) => `Assinatura cancelada: ${planName} - uai to na foto`,
  build: ({ userName, planName, validUntil, billingUrl }) => ({
    preheader: validUntil
      ? `A recorrência de ${planName} foi cancelada. O ciclo atual vale até ${validUntil}.`
      : `A recorrência de ${planName} foi cancelada.`,
    eyebrow: 'Assinatura cancelada',
    title: 'Sua assinatura foi cancelada',
    blocks: [
      emailBlocks.paragraph(`Olá, **${userName}**!`),
      emailBlocks.paragraph(`Confirmamos o cancelamento da recorrência do plano **${planName}**. Nenhuma nova cobrança será feita.`),
      emailBlocks.notice('info', [
        ...(validUntil ? [`O ciclo que você já pagou continua valendo até **${validUntil}**.`] : []),
        'Os créditos que já estão na sua conta continuam disponíveis para criar eventos.',
        'Eventos já criados seguem funcionando normalmente.'
      ], 'O que continua com você'),
      emailBlocks.paragraph('Mudou de ideia? Você pode assinar de novo a qualquer momento.'),
      emailBlocks.button('Ver planos', billingUrl)
    ]
  })
})

export default subscriptionCancelledEmail
