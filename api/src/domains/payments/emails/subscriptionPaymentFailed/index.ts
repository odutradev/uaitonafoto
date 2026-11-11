import { emailBlocks } from '@email/builder/blocks'
import { enrichEmail } from '@email/utils'

import type { SubscriptionPaymentFailedEmailVariables } from './types'

const subscriptionPaymentFailedEmail = enrichEmail<SubscriptionPaymentFailedEmailVariables>({
  subject: ({ planName }) => `Atenção: falha na cobrança de ${planName} - uaiToNaFoto`,
  build: ({ userName, planName, amountFormatted, paymentMethodLabel, appUrl }) => ({
    preheader: `Não conseguimos cobrar a assinatura ${planName}. Confira seu meio de pagamento.`,
    eyebrow: 'Pendência na assinatura',
    title: 'Não conseguimos concluir a cobrança',
    blocks: [
      emailBlocks.paragraph(`Olá, **${userName}**!`),
      emailBlocks.paragraph(`A cobrança recorrente do plano **${planName}** não foi concluída.`),
      emailBlocks.details([
        { label: 'Plano', value: planName },
        { label: 'Valor', value: amountFormatted },
        { label: 'Método de pagamento', value: paymentMethodLabel }
      ], 'Detalhes da cobrança'),
      emailBlocks.notice('danger', [
        `Confira os dados do seu meio de pagamento (**${paymentMethodLabel}**) para regularizar a assinatura.`,
        'Assim que o pagamento for confirmado, seus créditos mensais são liberados automaticamente.'
      ], 'O que fazer agora'),
      emailBlocks.button('Gerenciar minha assinatura', appUrl)
    ]
  })
})

export default subscriptionPaymentFailedEmail
